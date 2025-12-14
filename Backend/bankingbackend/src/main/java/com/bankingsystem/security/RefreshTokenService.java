package com.bankingsystem.security;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;

@Service
public class RefreshTokenService {

    private final JdbcTemplate jdbcTemplate;

    public RefreshTokenService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void storeRefreshToken(String jti, Integer userId, Date issuedAt, Date expiresAt) {
        jdbcTemplate.update("INSERT INTO refresh_tokens (jti, user_id, issued_at, expires_at, revoked) VALUES (?, ?, ?, ?, FALSE)",
                jti, userId, new Timestamp(issuedAt.getTime()), new Timestamp(expiresAt.getTime()));
    }

    public boolean isValid(String jti) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM refresh_tokens WHERE jti = ? AND revoked = FALSE AND expires_at > NOW()", new Object[]{jti}, Integer.class);
        return count != null && count > 0;
    }

    public void revokeByJti(String jti) {
        jdbcTemplate.update("UPDATE refresh_tokens SET revoked = TRUE WHERE jti = ?", jti);
    }

    public void revokeAllForUser(Integer userId) {
        jdbcTemplate.update("UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = ?", userId);
    }

    public Map<String,Object> findByJti(String jti){
        try {
            return jdbcTemplate.queryForMap("SELECT * FROM refresh_tokens WHERE jti = ?", jti);
        } catch (org.springframework.dao.EmptyResultDataAccessException ex) {
            return null;
        }
    }

	
}
