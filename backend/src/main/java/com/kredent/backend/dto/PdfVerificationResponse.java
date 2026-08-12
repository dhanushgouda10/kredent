package com.kredent.backend.dto;

/**
 * Response for the public, unauthenticated POST /api/verify/{certificateNumber}/pdf endpoint
 * (see PublicVerificationController / PublicVerificationService.verifyPdf). This is a simpler,
 * separate check than GET /api/verify/{certificateNumber}: it does NOT re-read the blockchain —
 * it only compares the SHA-256 of the uploaded PDF's bytes against the official hash already
 * stored in Postgres for that certificate (the same hash computed at upload time by
 * CertificateService.uploadFile, via HashUtil). A mismatch means the uploaded file's bytes are
 * not byte-for-byte identical to the one the college issued.
 */
public class PdfVerificationResponse {

    public enum Result {
        AUTHENTIC,
        TAMPERED,
        REVOKED
    }

    private boolean verified;
    private Result result;
    private String message;

    public static PdfVerificationResponse authentic() {
        PdfVerificationResponse dto = new PdfVerificationResponse();
        dto.verified = true;
        dto.result = Result.AUTHENTIC;
        dto.message = "This PDF's contents match the official certificate on file. It has not been altered.";
        return dto;
    }

    public static PdfVerificationResponse tampered() {
        PdfVerificationResponse dto = new PdfVerificationResponse();
        dto.verified = false;
        dto.result = Result.TAMPERED;
        dto.message = "This PDF does not match the official certificate on file. It may have been altered.";
        return dto;
    }

    public static PdfVerificationResponse revoked(String reason) {
        PdfVerificationResponse dto = new PdfVerificationResponse();
        dto.verified = false;
        dto.result = Result.REVOKED;
        dto.message = reason != null && !reason.isBlank()
                ? "This certificate has been revoked by the institution: " + reason
                : "This certificate has been revoked by the institution.";
        return dto;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
