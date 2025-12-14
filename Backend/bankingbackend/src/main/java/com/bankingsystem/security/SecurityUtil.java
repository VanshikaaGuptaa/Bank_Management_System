package com.bankingsystem.security;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private final JdbcTemplate jdbcTemplate;

    public SecurityUtil(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new RuntimeException("Unauthenticated");
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        // fallback: username -> user_id
        String username = auth.getName();
        Integer id = jdbcTemplate.queryForObject("SELECT user_id FROM user WHERE username = ?", new Object[]{username}, Integer.class);
        if (id == null) throw new RuntimeException("User not found for username: " + username);
        return id;
    }
}