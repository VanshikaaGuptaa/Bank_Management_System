package com.bankingsystem.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:please-change-this-to-a-very-long-secret-of-at-least-32-bytes}")
    private String jwtSecret;

    @Value("${app.jwt.access-token-validity-ms:600000}") // 10 minutes default
    private long accessTokenValidityMs;

    @Value("${app.jwt.refresh-token-validity-ms:1209600000}") // 14 days default
    private long refreshTokenValidityMs;

    private Key signingKey;
    private JwtParser jwtParser;

    @PostConstruct
    public void init() {
        // must be at least 256 bits for HS256 (32 bytes)
        byte[] keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parserBuilder().setSigningKey(signingKey).build();
    }

    // ---------------- Create tokens ----------------

    public String createAccessToken(Integer userId, String username, List<String> roles) {
        long now = System.currentTimeMillis();
        Date issuedAt = new Date(now);
        Date expiry = new Date(now + accessTokenValidityMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setId(UUID.randomUUID().toString())
                .claim("username", username)
                .claim("roles", roles)
                .setIssuedAt(issuedAt)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(Integer userId) {
        long now = System.currentTimeMillis();
        Date issuedAt = new Date(now);
        Date expiry = new Date(now + refreshTokenValidityMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(issuedAt)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ---------------- Parsing / helpers for controller & filter ----------------

    /**
     * Return true if the token is valid (signature + not expired).
     */
    public boolean validateToken(String token) {
        return parseClaims(token) != null;
    }

    /**
     * Return claims or null when invalid/expired.
     */
    public Claims parseClaims(String token) {
        if (token == null || token.trim().isEmpty()) return null;
        try {
            Jws<Claims> jws = jwtParser.parseClaimsJws(token);
            return jws.getBody();
        } catch (JwtException | IllegalArgumentException ex) {
            // invalid, expired, unsupported, malformed, etc.
            return null;
        }
    }

    /**
     * Get user id from token subject (returns null if token invalid).
     */
    public Integer getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        if (claims == null) return null;
        String subject = claims.getSubject();
        try {
            return subject == null ? null : Integer.valueOf(subject);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * Return jti (JWT ID) or null if invalid.
     */
    public String getJti(String token) {
        Claims claims = parseClaims(token);
        return claims == null ? null : claims.getId();
    }

    /**
     * Return expiration Date or null if invalid.
     */
    public Date getExpiry(String token) {
        Claims claims = parseClaims(token);
        return claims == null ? null : claims.getExpiration();
    }

    /**
     * Return expiry time in millis, or -1 if invalid.
     */
    public long getExpiryMillis(String token) {
        Date d = getExpiry(token);
        return (d == null) ? -1L : d.getTime();
    }
}