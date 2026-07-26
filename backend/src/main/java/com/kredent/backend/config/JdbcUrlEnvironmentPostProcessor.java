package com.kredent.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Accepts Supabase-style URIs ({@code postgresql://} / {@code postgres://}) by normalizing
 * them to JDBC form ({@code jdbc:postgresql://}) before the datasource is created.
 */
public class JdbcUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String DATASOURCE_URL = "spring.datasource.url";
    /** IntelliJ / shell env; maps before {@code application.properties} placeholder resolution in some cases */
    private static final String DB_URL_ENV = "DB_URL";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String url = firstNonBlank(
                environment.getProperty(DB_URL_ENV),
                environment.getProperty(DATASOURCE_URL));
        if (url == null || url.isBlank()) {
            return;
        }
        String trimmed = url.trim();
        if (trimmed.startsWith("${")) {
            return;
        }
        String jdbcUrl = toJdbcPostgresqlUrl(trimmed);
        if (!jdbcUrl.equals(trimmed)) {
            Map<String, Object> map = new HashMap<>();
            map.put(DATASOURCE_URL, jdbcUrl);
            environment.getPropertySources().addFirst(new MapPropertySource("normalizedJdbcUrl", map));
        }
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) {
            return a;
        }
        return b;
    }

    static String toJdbcPostgresqlUrl(String url) {
        if (url.startsWith("jdbc:")) {
            return url;
        }
        if (url.startsWith("postgresql://")) {
            return "jdbc:" + url;
        }
        if (url.startsWith("postgres://")) {
            return "jdbc:postgresql://" + url.substring("postgres://".length());
        }
        return url;
    }
}
