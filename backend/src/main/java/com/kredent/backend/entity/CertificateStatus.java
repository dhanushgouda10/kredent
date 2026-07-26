package com.kredent.backend.entity;

/**
 * Lifecycle of a certificate record. Minting/verification logic that moves a
 * certificate between these states is out of scope for this module — this
 * enum only exists so the entity's `status` column is type-safe from day one.
 */
public enum CertificateStatus {
    PENDING_MINT,
    MINTED,
    MINT_FAILED,
    REVOKED
}
