package com.kredent.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Metadata-only certificate creation — no file, no hash, no wallet, no
 * blockchain fields. Those arrive in later modules and get attached to the
 * same row.
 */
public class CertificateMetadataRequest {

    @NotNull
    private Long studentId;

    @NotBlank
    private String degreeName;

    @NotBlank
    private String department;

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
}
