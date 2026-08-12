package com.kredent.backend.dto;

import java.time.LocalDateTime;

/**
 * Response for the public, unauthenticated GET /api/verify/{certificateNumber} endpoint (see
 * PublicVerificationController / PublicVerificationService). Deliberately excludes anything not
 * needed to judge authenticity — no email, phone, USN, or internal certificate UUID.
 *
 * `result` is the one field the frontend should trust for the final badge: VERIFIED is only ever
 * set after a successful, independent on-chain read confirms the certificate isn't revoked and
 * its on-chain hash/recipient match what's stored — PostgreSQL is never trusted alone for that
 * verdict (see PublicVerificationService).
 */
public class PublicVerificationResponse {

    public enum Result {
        VERIFIED,
        REVOKED,
        INVALID,
        UNAVAILABLE
    }

    private String certificateNumber;
    private Result result;
    private String message;

    private String studentName;
    private String degreeName;
    private String department;
    private String institution;
    private Integer yearOfCompletion;
    private LocalDateTime issuedAt;
    private String certificateStatus;
    private String certificateHash;

    private String network;
    private String contractAddress;
    private Long tokenId;
    private String transactionHash;
    private LocalDateTime mintedAt;

    public static PublicVerificationResponse notFound(String certificateNumber) {
        PublicVerificationResponse dto = new PublicVerificationResponse();
        dto.certificateNumber = certificateNumber;
        dto.result = Result.INVALID;
        dto.message = "No certificate was found with this certificate number.";
        return dto;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getDegreeName() {
        return degreeName;
    }

    public void setDegreeName(String degreeName) {
        this.degreeName = degreeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getYearOfCompletion() {
        return yearOfCompletion;
    }

    public void setYearOfCompletion(Integer yearOfCompletion) {
        this.yearOfCompletion = yearOfCompletion;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getCertificateStatus() {
        return certificateStatus;
    }

    public void setCertificateStatus(String certificateStatus) {
        this.certificateStatus = certificateStatus;
    }

    public String getCertificateHash() {
        return certificateHash;
    }

    public void setCertificateHash(String certificateHash) {
        this.certificateHash = certificateHash;
    }

    public String getNetwork() {
        return network;
    }

    public void setNetwork(String network) {
        this.network = network;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

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

    public LocalDateTime getMintedAt() {
        return mintedAt;
    }

    public void setMintedAt(LocalDateTime mintedAt) {
        this.mintedAt = mintedAt;
    }
}
