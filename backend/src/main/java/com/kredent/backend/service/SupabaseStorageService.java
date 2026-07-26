package com.kredent.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

/**
 * Talks to Supabase Storage's REST API directly using Spring's built-in
 * RestClient (no Supabase SDK dependency needed). Uses the service role key
 * server-side only — the frontend never sees it or talks to Supabase
 * directly, everything goes through our own authorized endpoints.
 *
 * URIs are built manually with URI.create(...) rather than RestClient's
 * {template} variables: object paths contain literal "/" characters
 * (e.g. "certificates/1MJ21CS001/abc.pdf") which Spring's template expansion
 * would otherwise percent-encode, breaking the actual Supabase path.
 */
@Service
public class SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageService.class);

    private final RestClient restClient;
    private final String bucket;
    private final String baseUrl;
    private final String serviceRoleKey;
    private final boolean configured;

    public SupabaseStorageService(
            @Value("${supabase.url:}") String supabaseUrl,
            @Value("${supabase.service-role-key:}") String serviceRoleKey,
            @Value("${supabase.storage.bucket:certificates}") String bucket) {
        this.baseUrl = stripTrailingSlash(supabaseUrl);
        this.serviceRoleKey = serviceRoleKey;
        this.bucket = bucket;
        this.configured = !supabaseUrl.isBlank() && !serviceRoleKey.isBlank();
        this.restClient = RestClient.builder().build();

        if (!configured) {
            log.warn("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — certificate file "
                    + "upload/download/delete will fail until they're configured.");
        }
    }

    /** @return the informational object reference URL to store alongside the certificate row */
    public String upload(String objectPath, byte[] content, String contentType) {
        requireConfigured();
        try {
            restClient.post()
                    .uri(URI.create(baseUrl + "/storage/v1/object/" + bucket + "/" + objectPath))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apikey", serviceRoleKey)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(content)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            throw storageError("upload", e);
        }
        return baseUrl + "/storage/v1/object/" + bucket + "/" + objectPath;
    }

    public byte[] download(String objectPath) {
        requireConfigured();
        try {
            return restClient.get()
                    .uri(URI.create(baseUrl + "/storage/v1/object/" + bucket + "/" + objectPath))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apikey", serviceRoleKey)
                    .retrieve()
                    .body(byte[].class);
        } catch (RestClientResponseException e) {
            throw storageError("download", e);
        }
    }

    /** Best-effort: if the object (or bucket) is already gone, we still want the DB row removed. */
    public void delete(String objectPath) {
        if (!configured) {
            log.warn("Skipping storage delete for {} — Supabase Storage is not configured", objectPath);
            return;
        }
        try {
            restClient.method(HttpMethod.DELETE)
                    .uri(URI.create(baseUrl + "/storage/v1/object/" + bucket + "/" + objectPath))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apikey", serviceRoleKey)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            log.warn("Failed to delete storage object {} (continuing with DB cleanup): {} {}",
                    objectPath, e.getStatusCode(), safeBody(e));
        }
    }

    private void requireConfigured() {
        if (!configured) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Certificate storage is not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
        }
    }

    private ResponseStatusException storageError(String action, RestClientResponseException e) {
        HttpStatus status = HttpStatus.resolve(e.getStatusCode().value());
        String detail = safeBody(e);

        if (status == HttpStatus.NOT_FOUND) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Storage object or bucket not found while trying to " + action + " the file: " + detail);
        }
        if (status == HttpStatus.UNAUTHORIZED || status == HttpStatus.FORBIDDEN) {
            return new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Supabase rejected our storage credentials while trying to " + action + " the file "
                            + "— check SUPABASE_SERVICE_ROLE_KEY. Detail: " + detail);
        }
        return new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "Failed to " + action + " the file in storage: " + detail);
    }

    private String safeBody(RestClientResponseException e) {
        try {
            String body = e.getResponseBodyAsString();
            return (body == null || body.isBlank()) ? e.getMessage() : body;
        } catch (Exception ignored) {
            return e.getMessage();
        }
    }

    private static String stripTrailingSlash(String url) {
        if (url != null && url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }
}
