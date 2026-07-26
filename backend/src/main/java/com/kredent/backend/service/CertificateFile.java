package com.kredent.backend.service;

/**
 * Internal transport type between CertificateService and the download
 * controller — not a JSON DTO (it carries raw bytes), so it doesn't belong
 * in dto/ alongside the request/response shapes that get serialized.
 */
public record CertificateFile(byte[] content, String filename, String mimeType) {
}
