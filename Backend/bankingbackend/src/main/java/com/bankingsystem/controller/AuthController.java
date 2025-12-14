package com.bankingsystem.controller;

import com.bankingsystem.dto.LoginRequest;
import com.bankingsystem.security.JwtTokenProvider;
import com.bankingsystem.security.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtTokenProvider tokenProvider;
	@Autowired
	private RefreshTokenService refreshTokenService;

	// simple login endpoint
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest body) {
		try {
			String username = body.getUsername();
			String password = body.getPassword();

			// 1) Fetch full user row
			String sql = "SELECT user_id, password, role, status, full_name FROM user WHERE username = ?";
			Map<String, Object> user = jdbcTemplate.queryForMap(sql, username);

			// 2) Check password
			String hashed = (String) user.get("password");
			if (!passwordEncoder.matches(password, hashed)) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(Map.of("error", "Invalid username or password"));
			}

			String status = user.get("status").toString();

			// 3) BLOCK LOGIN WHEN TEMP PASSWORD NOT CHANGED
			if (status.equals("Inactive")) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
						Map.of("message", "Password update required before first login!", "action", "change_password"));
			}

			// 4) BLOCK IF STATUS != ACTIVE
			if (!status.equals("Active")) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account not active"));
			}

			// 5) Generate tokens now only if ACTIVE
			Integer userId = (Integer) user.get("user_id");
			String role = user.get("role").toString();
			String fullName = user.get("full_name").toString();

			String accessToken = tokenProvider.createAccessToken(userId, username, List.of(role));
			String refreshToken = tokenProvider.createRefreshToken(userId);

			refreshTokenService.storeRefreshToken(refreshToken, userId, new Date(),
					new Date(System.currentTimeMillis() + 604800000));

			return ResponseEntity.ok(Map.of("message", "Login Successful", "accessToken", accessToken, "refreshToken",
					refreshToken, "role", role, "userId", userId, "fullName", fullName));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Invalid Credentials / User Not Found"));
		}
	}

	// Refresh endpoint reads refresh token from cookie
	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
		if (refreshToken == null)
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No refresh token"));

		try {
			String jti = tokenProvider.getJti(refreshToken);
			if (!refreshTokenService.isValid(jti)) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(Map.of("error", "Refresh token invalid or revoked"));
			}
			Integer userId = tokenProvider.getUserIdFromToken(refreshToken);
			// optional: check user still active in DB
			Map<String, Object> user = jdbcTemplate.queryForMap("SELECT username, role FROM user WHERE user_id = ?",
					userId);
			String username = (String) user.get("username");
			String role = (String) user.get("role");
			List<String> roles = role != null ? List.of(role) : List.of();

			// rotate refresh token: revoke old and issue new
			refreshTokenService.revokeByJti(jti);

			String newAccess = tokenProvider.createAccessToken(userId, username, roles);
			String newRefresh = tokenProvider.createRefreshToken(userId);
			String newJti = tokenProvider.getJti(newRefresh);
			refreshTokenService.storeRefreshToken(newJti, userId, new Date(), tokenProvider.getExpiry(newRefresh));

			ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefresh).httpOnly(true).secure(true)
					.path("/api/auth/refresh")
					.maxAge((tokenProvider.getExpiry(newRefresh).getTime() - System.currentTimeMillis()) / 1000)
					.sameSite("Strict").build();

			return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
					.body(Map.of("accessToken", newAccess));
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
		}
	}

	// logout: revoke refresh token (read from cookie)
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
		if (refreshToken != null) {
			String jti = tokenProvider.getJti(refreshToken);
			refreshTokenService.revokeByJti(jti);
		}
		// expire cookie
		ResponseCookie cookie = ResponseCookie.from("refreshToken", "").httpOnly(true).secure(true)
				.path("/api/auth/refresh").maxAge(0).sameSite("Strict").build();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
				.body(Map.of("message", "Logged out"));
	}
}