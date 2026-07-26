package com.kredent.backend.dto;

import com.kredent.backend.entity.Certificate;
import com.kredent.backend.entity.CertificateStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Deliberately omits storagePath/fileUrl/fileHash/walletAddress/tokenId/contractAddress/txHash —
 * storagePath and fileUrl are internal storage details (the bucket is private; real access is
 * only ever through the backend's own authorized /download endpoint), and the blockchain/wallet
 * fields are still always null at this stage. fileAvailable is a derived boolean so the frontend
 * can show/hide a download button without needing to know anything about storage internals.
 */
public class CertificateResponse {

    private UUID id;
    private String certificateNumber;
    private Long studentId;
    private String studentName;
    private String studentUsn;
    private Long issuedByAdminId;
    private String issuedByAdminName;
    private String degreeName;
    private String department;
    private Integer yearOfCompletion;
    private CertificateStatus status;
    private LocalDateTime issuedAt;
    private LocalDateTime revokedAt;
    private String revokedReason;
    private boolean fileAvailable;
    private String originalFilename;
    private Long fileSizeBytes;
    private String mimeType;
    private LocalDateTime uploadedAt;

    public static CertificateResponse from(Certificate cert) {
        CertificateResponse dto = new CertificateResponse();
        dto.id = cert.getId();
        dto.certificateNumber = cert.getCertificateNumber();
        dto.studentId = cert.getStudent().getId();
        dto.studentName = cert.getStudent().getFullName();
        dto.studentUsn = cert.getStudent().getUsn();
        dto.issuedByAdminId = cert.getIssuedByAdmin().getId();
        dto.issuedByAdminName = cert.getIssuedByAdmin().getFullName();
        dto.degreeName = cert.getDegreeName();
        dto.department = cert.getDepartment();
        dto.yearOfCompletion = cert.getYearOfCompletion();
        dto.status = cert.getStatus();
        dto.issuedAt = cert.getIssuedAt();
        dto.revokedAt = cert.getRevokedAt();
        dto.revokedReason = cert.getRevokedReason();
        dto.fileAvailable = cert.getStoragePath() != null;
        dto.originalFilename = cert.getOriginalFilename();
        dto.fileSizeBytes = cert.getFileSizeBytes();
        dto.mimeType = cert.getMimeType();
        dto.uploadedAt = cert.getUploadedAt();
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentUsn() {
        return studentUsn;
    }

    public void setStudentUsn(String studentUsn) {
        this.studentUsn = studentUsn;
    }

    public Long getIssuedByAdminId() {
        return issuedByAdminId;
    }

    public void setIssuedByAdminId(Long issuedByAdminId) {
        this.issuedByAdminId = issuedByAdminId;
    }

    public String getIssuedByAdminName() {
        return issuedByAdminName;
    }

    public void setIssuedByAdminName(String issuedByAdminName) {
        this.issuedByAdminName = issuedByAdminName;
    }

    public String getDegreeName() {
        return degreeName;
    }

    public void setDegreeName(String degreeName) {
        this.degreeName = degreeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYearOfCompletion() {
        return yearOfCompletion;
    }

    public void setYearOfCompletion(Integer yearOfCompletion) {
        this.yearOfCompletion = yearOfCompletion;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(LocalDateTime revokedAt) {
        this.revokedAt = revokedAt;
    }

    public String getRevokedReason() {
        return revokedReason;
    }

    public void setRevokedReason(String revokedReason) {
        this.revokedReason = revokedReason;
    }

    public boolean isFileAvailable() {
        return fileAvailable;
    }

    public void setFileAvailable(boolean fileAvailable) {
        this.fileAvailable = fileAvailable;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
