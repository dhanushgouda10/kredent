package com.kredent.backend.controller;

import com.kredent.backend.dto.CertificateMetadataRequest;
import com.kredent.backend.dto.CertificateResponse;
import com.kredent.backend.dto.PageResponse;
import com.kredent.backend.dto.UpdateCertificateStatusRequest;
import com.kredent.backend.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminCertificateController {

    private final CertificateService certificateService;

    public AdminCertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/certificates")
    public ResponseEntity<CertificateResponse> createMetadata(@Valid @RequestBody CertificateMetadataRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificateService.createMetadata(request));
    }

    @DeleteMapping("/certificates/{id}")
    public ResponseEntity<Void> deleteMetadata(@PathVariable UUID id) {
        certificateService.deleteMetadata(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/certificates/{id}/status")
    public ResponseEntity<CertificateResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCertificateStatusRequest request) {
        return ResponseEntity.ok(certificateService.updateStatus(id, request));
    }

    @PostMapping(value = "/certificates/{id}/upload", consumes = "multipart/form-data")
    public ResponseEntity<CertificateResponse> uploadFile(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(certificateService.uploadFile(id, file));
    }

    @GetMapping("/students/{studentId}/certificates")
    public ResponseEntity<PageResponse<CertificateResponse>> getCertificatesForStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("issuedAt").descending());
        return ResponseEntity.ok(certificateService.getCertificatesForStudent(studentId, pageable));
    }
}
