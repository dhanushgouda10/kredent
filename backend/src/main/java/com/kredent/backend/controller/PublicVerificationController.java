package com.kredent.backend.controller;

import com.kredent.backend.dto.PdfVerificationResponse;
import com.kredent.backend.dto.PublicVerificationResponse;
import com.kredent.backend.service.PublicVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Public certificate verification — no login, no JWT. Reachable by anyone with a certificate
 * number (e.g. from a QR code or the certificate PDF itself). Already permitted through
 * SecurityConfig's existing `.requestMatchers("/api/verify/**").permitAll()` rule.
 *
 * Always returns 200 with a result field (VERIFIED/REVOKED/INVALID/UNAVAILABLE) rather than 404 —
 * "certificate not found" is itself a legitimate verification outcome (INVALID), not a routing
 * error, so the frontend doesn't need to special-case HTTP status codes to render the result.
 */
@RestController
@RequestMapping("/api/verify")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PublicVerificationController {

    private final PublicVerificationService publicVerificationService;

    public PublicVerificationController(PublicVerificationService publicVerificationService) {
        this.publicVerificationService = publicVerificationService;
    }

    @GetMapping("/{certificateNumber}")
    public ResponseEntity<PublicVerificationResponse> verify(@PathVariable String certificateNumber) {
        return ResponseEntity.ok(publicVerificationService.verify(certificateNumber));
    }

    /**
     * Separate, narrower check from the GET above: does NOT read the blockchain. Just confirms
     * the uploaded PDF's bytes hash to the same SHA-256 already on file for this certificate
     * (computed once, at upload time, by CertificateService.uploadFile).
     */
    @PostMapping(value = "/{certificateNumber}/pdf", consumes = "multipart/form-data")
    public ResponseEntity<PdfVerificationResponse> verifyPdf(
            @PathVariable String certificateNumber,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(publicVerificationService.verifyPdf(certificateNumber, file));
    }
}
