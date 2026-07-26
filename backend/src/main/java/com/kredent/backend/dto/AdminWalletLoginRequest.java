package com.kredent.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminWalletLoginRequest {

    @NotBlank
    private String walletAddress;

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }
}
