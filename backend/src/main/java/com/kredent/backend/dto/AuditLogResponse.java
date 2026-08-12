package com.kredent.backend.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Read-only view of an AuditLog row for the admin Audit Logs page (Phase 12). AuditLog itself
 * only stores actorId/entityId as loose Long/String values (see AuditLog's class comment) — this
 * DTO is where those get resolved into something a human can read: an admin's name instead of
 * just their id, a certificate number instead of just its UUID, and so on. See
 * AuditLogService.toResponse() for how each field is filled in.
 */
public class AuditLogResponse {

    private Long id;
    private LocalDateTime createdAt;
    private String action;
    private String actorType;
    private String actorName;
    private String entityType;
    private String entityId;
    private String certificateNumber;
    private String studentName;
    private String studentUsn;
    private String department;
    private String transactionHash;
    private Map<String, Object> details;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActorType() {
        return actorType;
    }

    public void setActorType(String actorType) {
        this.actorType = actorType;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}
