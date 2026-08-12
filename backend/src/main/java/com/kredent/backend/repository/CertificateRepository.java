package com.kredent.backend.repository;

import com.kredent.backend.entity.Certificate;
import com.kredent.backend.entity.CertificateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    Optional<Certificate> findByFileHash(String fileHash);

    Optional<Certificate> findByTokenId(Long tokenId);

    List<Certificate> findByStudentId(Long studentId);

    Page<Certificate> findByStudentId(Long studentId, Pageable pageable);

    List<Certificate> findByWalletAddress(String walletAddress);

    long countByDepartment(String department);

    long countByDepartmentAndStatus(String department, CertificateStatus status);

    @Query("""
            SELECT c FROM Certificate c
            WHERE LOWER(c.certificateNumber) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(c.student.usn) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(c.student.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    Page<Certificate> search(@Param("query") String query, Pageable pageable);

    // The full Certificate Registry filter — department, graduation year, and status are each
    // optional (pass null to mean "any"), combined with the same free-text search as search()
    // above, all evaluated server-side so the frontend never needs to fetch more than one page.
    @Query("""
            SELECT c FROM Certificate c
            WHERE (:department IS NULL OR c.department = :department)
              AND (:year IS NULL OR c.yearOfCompletion = :year)
              AND (:status IS NULL OR c.status = :status)
              AND (:query = '' OR
                   LOWER(c.certificateNumber) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(c.student.usn) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(c.student.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Certificate> searchFiltered(
            @Param("department") String department,
            @Param("year") Integer year,
            @Param("status") CertificateStatus status,
            @Param("query") String query,
            Pageable pageable);
}
