package com.kredent.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Metadata-only certificate creation — no file, no hash, no wallet, no
 * blockchain fields. Those arrive in later modules and get attached to the
 * same row.
 *
 * No `department` field here on purpose: a certificate's department is always taken from the
 * selected student's own department record (CertificateService.createMetadata), never entered
 * independently. That's a deliberate data-integrity fix — previously the admin picked a
 * department for the certificate separately from the student's own department, which could
 * silently disagree with each other.
 */
public class CertificateMetadataRequest {

    @NotNull
    private Long studentId;

    @NotBlank
    private String degreeName;

    @NotNull
    @Min(2000)
    @Max(2100)
    private Integer yearOfCompletion;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getDegreeName() {
        return degreeName;
    }

    public void setDegreeName(String degreeName) {
        this.degreeName = degreeName;
    }

    public Integer getYearOfCompletion() {
        return yearOfCompletion;
    }

    public void setYearOfCompletion(Integer yearOfCompletion) {
        this.yearOfCompletion = yearOfCompletion;
    }
}
