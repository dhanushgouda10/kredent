package com.kredent.backend.controller;

import com.kredent.backend.dto.AdminWalletLoginRequest;
import com.kredent.backend.dto.AuthResponse;
import com.kredent.backend.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/wallet-login")
    public ResponseEntity<AuthResponse> walletLogin(@Valid @RequestBody AdminWalletLoginRequest request) {
        return ResponseEntity.ok(adminAuthService.loginWithWallet(request));
    }
}
