package com.kredent.backend.util;

/**
 * Shared constants for the JWT auth flow, kept in one place instead of as
 * magic strings scattered across the security filter/config classes.
 */
public final class SecurityConstants {

    public static final String AUTH_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String ROLE_PREFIX = "ROLE_";

    private SecurityConstants() {
        // no instances
    }
}
