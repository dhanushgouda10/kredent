package com.kredent.backend.service;

import com.kredent.backend.dto.CertificateMetadataRequest;
import com.kredent.backend.dto.CertificateResponse;
import com.kredent.backend.dto.PageResponse;
import com.kredent.backend.dto.UpdateCertificateStatusRequest;
import com.kredent.backend.entity.ActorType;
import com.kredent.backend.entity.Admin;
import com.kredent.backend.entity.Certificate;
import com.kredent.backend.entity.CertificateStatus;
import com.kredent.backend.entity.Student;
import com.kredent.backend.repository.CertificateRepository;
import com.kredent.backend.repository.StudentRepository;
import com.kredent.backend.util.FileValidationUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Class-level @Transactional matters here specifically because Certificate's
 * student/issuedByAdmin associations are lazy (see entity comments): mapping
 * to CertificateResponse touches non-id fields on those proxies (fullName,
 * usn), which requires an open Hibernate session for the whole method, not
 * just for the repository call. This is a service-layer/JPA concern, not a
 * change to authentication.
 */
@Service
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final CurrentUserService currentUserService;
    private final AuditLogService auditLogService;
    private final SupabaseStorageService storageService;
    private final long maxFileSizeBytes;

    public CertificateService(
            CertificateRepository certificateRepository,
            StudentRepository studentRepository,
            CurrentUserService currentUserService,
            AuditLogService auditLogService,
            SupabaseStorageService storageService,
            @Value("${app.certificate.max-file-size-mb:5}") long maxFileSizeMb) {
        this.certificateRepository = certificateRepository;
        this.studentRepository = studentRepository;
        this.currentUserService = currentUserService;
        this.auditLogService = auditLogService;
        this.storageService = storageService;
        this.maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;
    }

    public CertificateResponse createMetadata(CertificateMetadataRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        Admin admin = currentUserService.getCurrentAdmin();

        Certificate certificate = new Certificate();
        certificate.setCertificateNumber(generateCertificateNumber(request.getYearOfCompletion()));
        certificate.setStudent(student);
        certificate.setIssuedByAdmin(admin);
        certificate.setDegreeName(request.getDegreeName());
        certificate.setDepartment(request.getDepartment());
        certificate.setYearOfCompletion(request.getYearOfCompletion());
        certificate.setStatus(CertificateStatus.PENDING_MINT);
        certificateRepository.save(certificate);

        auditLogService.record(
                ActorType.ADMIN,
                admin.getId(),
                "CERTIFICATE_METADATA_ISSUED",
                "CERTIFICATE",
                certificate.getId().toString(),
                Map.of("certificateNumber", certificate.getCertificateNumber(), "studentId", student.getId())
        );

        return CertificateResponse.from(certificate);
    }

    public CertificateResponse getById(UUID id) {
        Certificate certificate = findOrThrow(id);
        assertCanView(certificate);
        return CertificateResponse.from(certificate);
    }

    public PageResponse<CertificateResponse> getOwnCertificates(Pageable pageable) {
        Student student = currentUserService.getCurrentStudent();
        Page<Certificate> page = certificateRepository.findByStudentId(student.getId(), pageable);
        return PageResponse.from(page, CertificateResponse::from);
    }

    public PageResponse<CertificateResponse> getCertificatesForStudent(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        Page<Certificate> page = certificateRepository.findByStudentId(studentId, pageable);
        return PageResponse.from(page, CertificateResponse::from);
    }

    /**
     * Attaches a PDF to an already-created certificate metadata row (see
     * createMetadata above). Kept as a separate step deliberately — it
     * doesn't touch the existing metadata-creation flow at all.
     */
    public CertificateResponse uploadFile(UUID id, MultipartFile file) {
        Certificate certificate = findOrThrow(id);
        validateFile(file);

        byte[] content;
        try {
            content = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read the uploaded file");
        }

        if (!FileValidationUtil.looksLikePdf(content)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The file does not look like a valid PDF (failed signature check)");
        }

        String sanitizedUsn = certificate.getStudent().getUsn().replaceAll("[^A-Za-z0-9]", "");
        String objectPath = "certificates/" + sanitizedUsn + "/" + UUID.randomUUID() + ".pdf";

        String fileUrl = storageService.upload(objectPath, content, FileValidationUtil.PDF_CONTENT_TYPE);

        certificate.setStoragePath(objectPath);
        certificate.setFileUrl(fileUrl);
        certificate.setOriginalFilename(file.getOriginalFilename());
        certificate.setFileSizeBytes((long) content.length);
        certificate.setMimeType(FileValidationUtil.PDF_CONTENT_TYPE);
        certificate.setUploadedAt(LocalDateTime.now());
        certificateRepository.save(certificate);

        Admin admin = currentUserService.getCurrentAdmin();
        auditLogService.record(
                ActorType.ADMIN,
                admin.getId(),
                "CERTIFICATE_FILE_UPLOADED",
                "CERTIFICATE",
                id.toString(),
                Map.of(
                        "originalFilename", String.valueOf(file.getOriginalFilename()),
                        "fileSizeBytes", content.length
                )
        );

        return CertificateResponse.from(certificate);
    }

    public CertificateFile downloadFile(UUID id) {
        Certificate certificate = findOrThrow(id);
        assertCanView(certificate);

        if (certificate.getStoragePath() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No file has been uploaded for this certificate yet");
        }

        byte[] content = storageService.download(certificate.getStoragePath());
        String filename = certificate.getOriginalFilename() != null
                ? certificate.getOriginalFilename()
                : certificate.getCertificateNumber() + ".pdf";
        String mimeType = certificate.getMimeType() != null ? certificate.getMimeType() : FileValidationUtil.PDF_CONTENT_TYPE;

        return new CertificateFile(content, filename, mimeType);
    }

    public void deleteMetadata(UUID id) {
        Certificate certificate = findOrThrow(id);
        Admin admin = currentUserService.getCurrentAdmin();

        boolean hadFile = certificate.getStoragePath() != null;
        Map<String, Object> metadata = Map.of(
                "certificateNumber", certificate.getCertificateNumber(),
                "studentId", certificate.getStudent().getId(),
                "fileDeleted", hadFile
        );

        if (hadFile) {
            storageService.delete(certificate.getStoragePath());
        }
        certificateRepository.delete(certificate);

        auditLogService.record(
                ActorType.ADMIN,
                admin.getId(),
                "CERTIFICATE_METADATA_DELETED",
                "CERTIFICATE",
                id.toString(),
                metadata
        );
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file was uploaded, or the file is empty");
        }
        if (!FileValidationUtil.isDeclaredPdf(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF files are accepted");
        }
        if (file.getSize() > maxFileSizeBytes) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                    "File exceeds the maximum allowed size of " + (maxFileSizeBytes / (1024 * 1024)) + "MB");
        }
    }

    public CertificateResponse updateStatus(UUID id, UpdateCertificateStatusRequest request) {
        Certificate certificate = findOrThrow(id);

        if (request.getStatus() == CertificateStatus.REVOKED && (request.getReason() == null || request.getReason().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A reason is required to revoke a certificate");
        }

        CertificateStatus previousStatus = certificate.getStatus();
        certificate.setStatus(request.getStatus());

        if (request.getStatus() == CertificateStatus.REVOKED) {
            certificate.setRevokedAt(LocalDateTime.now());
            certificate.setRevokedReason(request.getReason());
        } else {
            certificate.setRevokedAt(null);
            certificate.setRevokedReason(null);
        }
        certificateRepository.save(certificate);

        Admin admin = currentUserService.getCurrentAdmin();
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("from", previousStatus);
        metadata.put("to", request.getStatus());
        if (request.getReason() != null) {
            metadata.put("reason", request.getReason());
        }
        auditLogService.record(
                ActorType.ADMIN,
                admin.getId(),
                "CERTIFICATE_STATUS_UPDATED",
                "CERTIFICATE",
                id.toString(),
                metadata
        );

        return CertificateResponse.from(certificate);
    }

    private Certificate findOrThrow(UUID id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));
    }

    private void assertCanView(Certificate certificate) {
        if (currentUserService.isAdmin()) {
            return;
        }
        if (currentUserService.isStudent()) {
            Student student = currentUserService.getCurrentStudent();
            if (certificate.getStudent().getId().equals(student.getId())) {
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this certificate");
    }

    private String generateCertificateNumber(int year) {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "SKC-" + year + "-" + suffix;
    }
}
