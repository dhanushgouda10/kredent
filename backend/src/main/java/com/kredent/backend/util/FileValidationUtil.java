package com.kredent.backend.util;

import java.nio.charset.StandardCharsets;

/**
 * PDF validation that doesn't just trust the client's declared Content-Type
 * (easily spoofed) — checks the actual file signature bytes too. Every real
 * PDF starts with "%PDF-" (0x25 0x50 0x44 0x46 0x2D).
 */
public final class FileValidationUtil {

    private static final String PDF_MAGIC = "%PDF-";
    public static final String PDF_CONTENT_TYPE = "application/pdf";

    private FileValidationUtil() {
        // no instances
    }

    public static boolean looksLikePdf(byte[] content) {
        if (content == null || content.length < PDF_MAGIC.length()) {
            return false;
        }
        String header = new String(content, 0, PDF_MAGIC.length(), StandardCharsets.US_ASCII);
        return PDF_MAGIC.equals(header);
    }

    public static boolean isDeclaredPdf(String contentType) {
        return PDF_CONTENT_TYPE.equalsIgnoreCase(contentType);
    }
}
