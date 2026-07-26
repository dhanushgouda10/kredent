package com.kredent.backend.config;

import com.kredent.backend.entity.Admin;
import com.kredent.backend.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds one admin record on startup so the wallet-login flow has something to
 * match against. Configure via env vars (see application.properties):
 * ADMIN_EMAIL, ADMIN_FULL_NAME, ADMIN_WALLET_ADDRESS.
 *
 * If ADMIN_WALLET_ADDRESS is not set, no admin is seeded and wallet login will
 * reject everyone until an admin row is added (manually, or via a future
 * "manage admins" endpoint).
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final AdminRepository adminRepository;
    private final String seedEmail;
    private final String seedFullName;
    private final String seedWallet;

    public AdminSeeder(
            AdminRepository adminRepository,
            @Value("${admin.seed.email:}") String seedEmail,
            @Value("${admin.seed.full-name:MVJCE Admin}") String seedFullName,
            @Value("${admin.seed.wallet-address:}") String seedWallet) {
        this.adminRepository = adminRepository;
        this.seedEmail = seedEmail;
        this.seedFullName = seedFullName;
        this.seedWallet = seedWallet;
    }

    @Override
    public void run(String... args) {
        if (seedWallet == null || seedWallet.isBlank()) {
            log.warn("ADMIN_WALLET_ADDRESS not set — skipping admin seed. Wallet login will reject all admins until one is created.");
            return;
        }

        String normalizedWallet = seedWallet.toLowerCase();
        if (adminRepository.findByWalletAddress(normalizedWallet).isPresent()) {
            return;
        }

        Admin admin = new Admin();
        admin.setFullName(seedFullName);
        admin.setEmail(seedEmail == null || seedEmail.isBlank() ? "admin@kredent.local" : seedEmail);
        admin.setWalletAddress(normalizedWallet);
        adminRepository.save(admin);
        log.info("Seeded default admin with wallet address {}", normalizedWallet);
    }
}
