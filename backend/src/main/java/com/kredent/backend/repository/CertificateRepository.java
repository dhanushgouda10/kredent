package com.kredent.backend.repository;

import com.kredent.backend.entity.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
