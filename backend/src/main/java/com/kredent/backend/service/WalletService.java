package com.kredent.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Keys;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * System-managed student wallets (SkillChain Phase 3, "Option B").
 *
 * Every student gets a brand-new Ethereum-compatible keypair the moment their
 * account is first created (see AuthService.register and
 * StudentService.adminCreateStudent — both call generateWallet() exactly
 * once, right before the first save). Only the PUBLIC address is ever
 * returned in plain form; the private key is AES-256-GCM encrypted with a
 * server-only secret (WALLET_ENCRYPTION_SECRET) before it's persisted, and
 * is never logged, never returned by any API response, and never sent to
 * the frontend.
 *
 * Nothing in Phase 3 actually needs to decrypt a student's key — the
 * admin's MetaMask signs every mint/revoke transaction, and the student's
 * wallet only ever appears as the *recipient* address, which needs no
 * signature at all. decrypt() exists for completeness / future phases and
 * is intentionally unused today.
 */
@Service
public class WalletService {

    private static final String AES_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH_BYTES = 12;
    private static final int GCM_TAG_LENGTH_BITS = 128;
    private static final int PRIVATE_KEY_HEX_LENGTH = 64;

    private final SecretKey encryptionKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public WalletService(@Value("${wallet.encryption-secret}") String encryptionSecret) {
        this.encryptionKey = deriveKey(encryptionSecret);
    }

    /** Result of generating a new wallet: the public address, and the private key ready to store (already encrypted). */
    public static class GeneratedWallet {
        private final String address;
        private final String encryptedPrivateKey;

        GeneratedWallet(String address, String encryptedPrivateKey) {
            this.address = address;
            this.encryptedPrivateKey = encryptedPrivateKey;
        }

        public String getAddress() {
            return address;
        }

        public String getEncryptedPrivateKey() {
            return encryptedPrivateKey;
        }
    }

    /** Generates a brand-new Ethereum-compatible keypair for a student. Called once per student, at creation time. */
    public GeneratedWallet generateWallet() {
        try {
            ECKeyPair keyPair = Keys.createEcKeyPair();
            String address = ("0x" + Keys.getAddress(keyPair)).toLowerCase();

            String privateKeyHex = keyPair.getPrivateKey().toString(16);
            if (privateKeyHex.length() < PRIVATE_KEY_HEX_LENGTH) {
                privateKeyHex = "0".repeat(PRIVATE_KEY_HEX_LENGTH - privateKeyHex.length()) + privateKeyHex;
            }

            String encrypted = encrypt(privateKeyHex);
            return new GeneratedWallet(address, encrypted);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate a student wallet", e);
        }
    }

    private String encrypt(String plainText) throws Exception {
        byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
        secureRandom.nextBytes(iv);

        Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
        byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

        // Store IV + ciphertext together (IV doesn't need to be secret, just unique per encryption).
        byte[] combined = new byte[iv.length + cipherText.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(cipherText, 0, combined, iv.length, cipherText.length);
        return Base64.getEncoder().encodeToString(combined);
    }

    /** Not called anywhere in Phase 3 — kept for future phases that may need the system to act on a student's behalf. */
    String decrypt(String encoded) throws Exception {
        byte[] combined = Base64.getDecoder().decode(encoded);
        byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
        byte[] cipherText = new byte[combined.length - GCM_IV_LENGTH_BYTES];
        System.arraycopy(combined, 0, iv, 0, GCM_IV_LENGTH_BYTES);
        System.arraycopy(combined, GCM_IV_LENGTH_BYTES, cipherText, 0, cipherText.length);

        Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, encryptionKey, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
        return new String(cipher.doFinal(cipherText), StandardCharsets.UTF_8);
    }

    private static SecretKey deriveKey(String secret) {
        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha256.digest(secret.getBytes(StandardCharsets.UTF_8));
            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to derive the wallet encryption key", e);
        }
    }
}
