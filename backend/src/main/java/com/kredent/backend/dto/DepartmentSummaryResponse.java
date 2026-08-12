package com.kredent.backend.dto;

/**
 * Real, DB-computed counts for one department — backs the "department dashboard" strip at the
 * top of the admin Certificate Registry (GET /api/admin/departments/{code}/summary). Every
 * number here comes from a COUNT query against the actual students/certificates tables; nothing
 * is estimated or hardcoded.
 */
public class DepartmentSummaryResponse {

    private String code;
    private String label;
    private long totalStudents;
    private long totalCertificates;
    private long pendingMint;
    private long minted;
    private long mintFailed;
    private long revoked;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }

    public long getPendingMint() {
        return pendingMint;
    }

    public void setPendingMint(long pendingMint) {
        this.pendingMint = pendingMint;
    }

    public long getMinted() {
        return minted;
    }

    public void setMinted(long minted) {
        this.minted = minted;
    }

    public long getMintFailed() {
        return mintFailed;
    }

    public void setMintFailed(long mintFailed) {
        this.mintFailed = mintFailed;
    }

    public long getRevoked() {
        return revoked;
    }

    public void setRevoked(long revoked) {
        this.revoked = revoked;
    }
}
