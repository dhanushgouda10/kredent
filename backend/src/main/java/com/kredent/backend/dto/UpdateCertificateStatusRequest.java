package com.kredent.backend.dto;

import com.kredent.backend.entity.CertificateStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateCertificateStatusRequest {

    @NotNull
    private CertificateStatus status;

    /** Required by the service when status is REVOKED; optional otherwise. */
    private String reason;

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
