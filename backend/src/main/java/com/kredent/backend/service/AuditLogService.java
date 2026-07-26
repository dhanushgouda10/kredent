package com.kredent.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kredent.backend.entity.ActorType;
import com.kredent.backend.entity.AuditLog;
import com.kredent.backend.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Writes append-only audit entries. Nothing ever updates or deletes a row
 * through this service on purpose — see docs/architecture.md Security Design.
 */
@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    private final HttpServletRequest request;

    public AuditLogService(AuditLogRepository auditLogRepository, ObjectMapper objectMapper, HttpServletRequest request) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public void record(ActorType actorType, Long actorId, String action, String entityType, String entityId, Map<String, Object> metadata) {
        AuditLog entry = new AuditLog();
        entry.setActorType(actorType);
        entry.setActorId(actorId);
        entry.setAction(action);
        entry.setEntityType(entityType);
        entry.setEntityId(entityId);
        entry.setMetadata(toJson(metadata));
        entry.setIpAddress(safeRemoteAddress());
        auditLogRepository.save(entry);
    }

    private String toJson(Map<String, Object> metadata) {
        if (metadata == null || metadata.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(metadata);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize audit log metadata, storing without it", e);
            return null;
        }
    }

    private String safeRemoteAddress() {
        try {
            return request.getRemoteAddr();
        } catch (Exception e) {
            return null;
        }
    }
}
