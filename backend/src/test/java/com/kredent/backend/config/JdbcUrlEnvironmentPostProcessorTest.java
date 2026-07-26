package com.kredent.backend.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JdbcUrlEnvironmentPostProcessorTest {

    @Test
    void normalizesPostgresqlScheme() {
        assertThat(JdbcUrlEnvironmentPostProcessor.toJdbcPostgresqlUrl(
                "postgresql://host:5432/db?sslmode=require"))
                .isEqualTo("jdbc:postgresql://host:5432/db?sslmode=require");
    }

    @Test
    void keepsJdbcPrefix() {
        assertThat(JdbcUrlEnvironmentPostProcessor.toJdbcPostgresqlUrl(
                "jdbc:postgresql://host:5432/postgres"))
                .isEqualTo("jdbc:postgresql://host:5432/postgres");
    }

    @Test
    void normalizesPostgresAlias() {
        assertThat(JdbcUrlEnvironmentPostProcessor.toJdbcPostgresqlUrl(
                "postgres://user@host:5432/db"))
                .isEqualTo("jdbc:postgresql://user@host:5432/db");
    }
}
