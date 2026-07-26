package com.kredent.backend.repository;

import com.kredent.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByEmail(String email);

    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByWalletAddress(String walletAddress);
}
