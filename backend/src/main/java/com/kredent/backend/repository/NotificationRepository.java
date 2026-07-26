package com.kredent.backend.repository;

import com.kredent.backend.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    Page<Notification> findByStudentId(Long studentId, Pageable pageable);

    List<Notification> findByStudentIdAndIsReadFalse(Long studentId);
}
