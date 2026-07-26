package com.kredent.backend.dto;

import com.kredent.backend.entity.Notification;
import com.kredent.backend.entity.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponse {

    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private boolean read;
    private UUID certificateId;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        NotificationResponse dto = new NotificationResponse();
        dto.id = notification.getId();
        dto.type = notification.getType();
        dto.title = notification.getTitle();
        dto.message = notification.getMessage();
        dto.read = notification.isRead();
        dto.certificateId = notification.getCertificate() != null ? notification.getCertificate().getId() : null;
        dto.createdAt = notification.getCreatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public UUID getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(UUID certificateId) {
        this.certificateId = certificateId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
