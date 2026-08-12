package com.kredent.backend.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.EnumMap;
import java.util.Map;

/**
 * Generates the QR code image stamped onto every issued certificate PDF (see
 * PdfStampingService). The QR encodes nothing but the public verification URL (e.g.
 * https://kredent.../verify/SKC-2027-DA767C95) — the same page anyone can already reach by
 * typing a certificate number in by hand. Scanning it is a shortcut to that page, not a
 * separate trust mechanism: the actual anti-forgery guarantee comes from the QR being
 * physically part of the hashed PDF bytes (PdfStampingService + CertificateService.uploadFile
 * hash the STAMPED output), not from anything encoded inside the QR image itself.
 */
public final class QrCodeUtil {

    private static final int SIZE_PX = 220;

    private QrCodeUtil() {
        // no instances
    }

    /** @return a PNG-encoded QR code image for the given text (typically a verification URL) */
    public static byte[] generatePng(String text) {
        try {
            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix matrix = new QRCodeWriter().encode(text, BarcodeFormat.QR_CODE, SIZE_PX, SIZE_PX, hints);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", out);
            return out.toByteArray();
        } catch (WriterException | IOException e) {
            throw new IllegalStateException("Failed to generate QR code for verification URL", e);
        }
    }
}
