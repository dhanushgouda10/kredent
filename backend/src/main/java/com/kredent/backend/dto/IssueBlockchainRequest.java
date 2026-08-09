package com.kredent.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Sent by the admin frontend AFTER MetaMask has already signed and submitted the
 * issueCredential() transaction on-chain and it was mined. The backend does not mint
 * anything itself here — it verifies this report against the real transaction receipt
 * (BlockchainVerificationService) and against its own stored data before saving it.
 */
public class IssueBlockchainRequest {

    @NotBlank
    private String studentWalletAddress;

    @NotBlank
    private String certificateHash;

    @NotNull
    private Long tokenId;

    @NotBlank
    private String contractAddress;

    @NotBlank
    private String transactionHash;

    public String getStudentWalletAddress() {
        return studentWalletAddress;
    }

    public void setStudentWalletAddress(String studentWalletAddress) {
        this.studentWalletAddress = studentWalletAddress;
    }

    public String getCertificateHash() {
        return certificateHash;
    }

    public void setCertificateHash(String certificateHash) {
        this.certificateHash = certificateHash;
    }

    public Long getTokenId() {
        return tokenId;
    }

    public void setTokenId(Long tokenId) {
        this.tokenId = tokenId;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }
}
