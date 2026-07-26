package com.kredent.backend.repository;

import com.kredent.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Intentionally minimal — no service writes to this yet (audit logging
 * business logic is a later module). The repository exists now so the
 * table/entity are in place ahead of that work.
 */
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
