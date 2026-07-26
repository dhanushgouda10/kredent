package com.kredent.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Self-service profile update. Deliberately does not include email/usn —
 * those are login/identity fields and changing them isn't part of this
 * module's scope.
 */
public class UpdateStudentProfileRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String phone;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
