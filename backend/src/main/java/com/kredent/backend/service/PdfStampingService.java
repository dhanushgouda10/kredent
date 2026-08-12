package com.kredent.backend.service;

import com.kredent.backend.util.QrCodeUtil;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Stamps a QR code onto page 1 of an admin-uploaded certificate PDF (Phase 11). This runs
 * BEFORE hashing in CertificateService.uploadFile() — the SHA-256 hash that gets stored and
 * later minted on-chain is computed on the STAMPED output of this class, never on the raw
 * upload. That ordering is what makes the QR forgery-resistant: it becomes part of the exact
 * bytes the hash represents, so copying the QR into a different or edited PDF produces a file
 * whose hash no longer matches what's on record (caught by
 * PublicVerificationService.verifyPdf — POST /api/verify/{certificateNumber}/pdf).
 *
 * Deliberately narrow: only draws an image onto an existing page, never rewrites page content,
 * text, fonts, or layout — the admin's original certificate design is untouched apart from the
 * QR added in the corner. No template engine, no student-photo handling — that's a separate,
 * bigger change this phase intentionally does not make.
 */
@Service
public class PdfStampingService {

    private static final float QR_SIZE_PT = 90f;
    private static final float MARGIN_PT = 24f;

    /**
     * @param originalPdfBytes an already-validated PDF (see FileValidationUtil) — this method
     *                          does not re-validate it
     * @param verificationUrl  the public verify URL to encode into the QR, e.g.
     *                          "https://kredent.../verify/SKC-2027-DA767C95"
     * @return new PDF bytes: the original document with a QR code drawn in the bottom-right
     *          corner of page 1
     */
    public byte[] stampQrCode(byte[] originalPdfBytes, String verificationUrl) {
        byte[] qrPng = QrCodeUtil.generatePng(verificationUrl);

        try (PDDocument document = PDDocument.load(originalPdfBytes)) {
            if (document.getNumberOfPages() == 0) {
                throw new IllegalStateException("Uploaded PDF has no pages to stamp");
            }

            PDPage firstPage = document.getPage(0);
            PDRectangle mediaBox = firstPage.getMediaBox();
            PDImageXObject qrImage = PDImageXObject.createFromByteArray(document, qrPng, "verification-qr");

            float x = mediaBox.getLowerLeftX() + mediaBox.getWidth() - QR_SIZE_PT - MARGIN_PT;
            float y = mediaBox.getLowerLeftY() + MARGIN_PT;

            // APPEND + resetContext=true: adds to the page's existing content stream rather than
            // replacing it, so nothing the admin already put on the page is touched or removed.
            try (PDPageContentStream contentStream = new PDPageContentStream(
                    document, firstPage, PDPageContentStream.AppendMode.APPEND, true, true)) {
                contentStream.drawImage(qrImage, x, y, QR_SIZE_PT, QR_SIZE_PT);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to stamp QR code onto the certificate PDF", e);
        }
    }
}
