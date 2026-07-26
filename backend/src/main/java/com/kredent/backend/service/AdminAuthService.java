package com.kredent.backend.service;

import com.kredent.backend.dto.AdminWalletLoginRequest;
import com.kredent.backend.dto.AuthResponse;
import com.kredent.backend.entity.Admin;
import com.kredent.backend.entity.Role;
import com.kredent.backend.repository.AdminRepository;
import com.kredent.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;

    public AdminAuthService(AdminRepository adminRepository, JwtService jwtService) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
    }

    /**
     * Wallet-address login: the frontend has already asked MetaMask for the
     * connected account (eth_requestAccounts) and sends us the address.
     *
     * NOTE: this only checks that the address belongs to a pre-registered admin
     * record — it does not yet prove the caller controls the private key for
     * that address. Real proof-of-ownership (sign a server-issued nonce, verify
     * the ECDSA signature server-side) is planned for the Blockchain module,
     * once Ethers.js/web3j are wired in. Until then, do not treat this endpoint
     * as fully secure against a spoofed wallet address.
     */
    public AuthResponse loginWithWallet(AdminWalletLoginRequest request) {
        String address = request.getWalletAddress().toLowerCase();

        Admin admin = adminRepository.findByWalletAddress(address)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "This wallet is not registered as an admin"));

        String token = jwtService.generateToken(admin.getWalletAddress(), Role.ADMIN.name(), admin.getId());
        return new AuthResponse(token, Role.ADMIN.name(), admin.getId(), admin.getFullName(), admin.getEmail());
    }
}
