package com.kredent.backend.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Computes the SHA-256 hash of a certificate PDF's raw bytes. This is the
 * "fingerprint" of the file: if even one byte of the PDF changes, the hash
 * changes completely. Storing this hash alongside the certificate lets
 * anyone later prove a PDF is untouched by re-hashing it and comparing.
 */
public final class HashUtil {

    private static final String ALGORITHM = "SHA-256";
    private static final char[] HEX_DIGITS = "0123456789abcdef".toCharArray();

    private HashUtil() {
        // no instances
    }

    /** @return the SHA-256 hash of the given bytes, as a lowercase 64-character hex string */
    public static String sha256Hex(byte[] content) {
        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            byte[] hashBytes = digest.digest(content);
            return toHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is a standard JDK algorithm — this can only happen if the JVM itself is broken.
            throw new IllegalStateException("SHA-256 is not available on this JVM", e);
        }
    }

    private static String toHex(byte[] bytes) {
        char[] out = new char[bytes.length * 2];
        for (int i = 0; i < bytes.length; i++) {
            int value = bytes[i] & 0xFF;
            out[i * 2] = HEX_DIGITS[value >>> 4];
            out[i * 2 + 1] = HEX_DIGITS[value & 0x0F];
        }
        return new String(out);
    }
}
