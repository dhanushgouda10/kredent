package com.kredent.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Sent by the admin frontend AFTER MetaMask has already signed and submitted the
 * revokeCredential() transaction on-chain and it was mined.
 */
public class RevokeBlockchainRequest {

    @NotNull
    private Long tokenId;

    @NotBlank
    private String transactionHash;

    @NotBlank
    private String reason;

    public Long getTokenId() {
        return tokenId;
    }

    public void setTokenId(Long tokenId) {
        this.tokenId = tokenId;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
