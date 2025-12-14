package com.bankingsystem.controller;

import com.bankingsystem.BankingSystem.BankingSystemApplication;
import com.bankingsystem.dto.LoginRequest;
//import com.bankingsystem.service.RefreshTokenService;
//import com.bankingsystem.service.TokenProvider;
import com.bankingsystem.security.JwtTokenProvider;
import com.bankingsystem.security.RefreshTokenService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.Cookie;

import java.util.Map;
import java.util.List;
import java.util.Date;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = BankingSystemApplication.class)
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @MockBean
    private RefreshTokenService refreshTokenService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginRequest login;

    @BeforeEach
    void setup() {
        login = new LoginRequest();
        login.setUsername("user1");
        login.setPassword("pass123");
    }

    @Test
    void testLogin_success() throws Exception {
        Map<String, Object> userRow = Map.of(
            "user_id", 1,
            "password", "$2a$10$hashed",
            "role", "USER",
            "status", "Active",
            "full_name", "Akshitha"
        );

        when(jdbcTemplate.queryForMap(anyString(), eq("user1"))).thenReturn(userRow);
        when(passwordEncoder.matches(eq("pass123"), eq("$2a$10$hashed"))).thenReturn(true);
        when(tokenProvider.createAccessToken(any(), any(), any())).thenReturn("access-token");
        when(tokenProvider.createRefreshToken(any())).thenReturn("refresh-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Login Successful"))
            .andExpect(jsonPath("$.accessToken").value("access-token"));
    }

    @Test
    void testLogin_invalidPassword() throws Exception {
        Map<String, Object> userRow = Map.of(
            "user_id", 1,
            "password", "$2a$10$hashed",
            "role", "USER",
            "status", "Active",
            "full_name", "Akshitha"
        );

        when(jdbcTemplate.queryForMap(anyString(), eq("user1"))).thenReturn(userRow);
        when(passwordEncoder.matches(eq("pass123"), eq("$2a$10$hashed"))).thenReturn(false);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    void testLogin_inactiveUser() throws Exception {
        Map<String, Object> userRow = Map.of(
            "user_id", 1,
            "password", "$2a$10$hashed",
            "role", "USER",
            "status", "Inactive",
            "full_name", "Akshitha"
        );

        when(jdbcTemplate.queryForMap(anyString(), eq("user1"))).thenReturn(userRow);
        when(passwordEncoder.matches(eq("pass123"), eq("$2a$10$hashed"))).thenReturn(true);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.message").value("Password update required before first login!"));
    }

    @Test
    void testRefreshToken_success() throws Exception {
        String refreshToken = "valid-refresh-token";
        String jti = "jti-123";
        Integer userId = 1;

        when(tokenProvider.getJti(refreshToken)).thenReturn(jti);
        when(refreshTokenService.isValid(jti)).thenReturn(true);
        when(tokenProvider.getUserIdFromToken(refreshToken)).thenReturn(userId);
        when(jdbcTemplate.queryForMap(anyString(), eq(userId))).thenReturn(Map.of("username", "user1", "role", "USER"));
        when(tokenProvider.createAccessToken(any(), any(), any())).thenReturn("new-access-token");
        when(tokenProvider.createRefreshToken(any())).thenReturn("new-refresh-token");
        when(tokenProvider.getExpiry(anyString())).thenReturn(new Date(System.currentTimeMillis() + 604800000));

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshToken)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").value("new-access-token"));
    }

    @Test
    void testLogout_success() throws Exception {
        String refreshToken = "valid-refresh-token";
        String jti = "jti-123";

        when(tokenProvider.getJti(refreshToken)).thenReturn(jti);

        mockMvc.perform(post("/api/auth/logout")
                .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshToken)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Logged out"));
    }
}







































//package com.bankingsystem.controller;
//
////import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import java.util.Map;
//
////import org.junit.jupiter.api.AfterAll;
////import org.junit.jupiter.api.AfterEach;
////import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.web.servlet.MockMvc;
//
//import com.bankingsystem.BankingSystem.BankingSystemApplication;
//import com.bankingsystem.dto.LoginRequest;
//import com.bankingsystem.security.JwtTokenProvider;
//import com.bankingsystem.security.RefreshTokenService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
////@WebMvcTest(AuthController.class)//@WebMvcTest loads only web layer(controllers+filters)
//@SpringBootTest(classes = BankingSystemApplication.class)//@springBootTest loads entire spring context(full app)
//@AutoConfigureMockMvc
//public class AuthControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private JdbcTemplate jdbcTemplate;
//
//    @MockBean
//    private PasswordEncoder passwordEncoder;
//
//    @MockBean
//    private JwtTokenProvider tokenProvider;
//
//    @MockBean
//    private RefreshTokenService refreshTokenService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private LoginRequest login;
//    
//    @BeforeEach
//    void setup() {
//        objectMapper = new ObjectMapper();
//    }
//
//    @Test
//    void testLogin_success() throws Exception {
//        LoginRequest login = new LoginRequest();
//        login.setUsername("user1");
//        login.setPassword("pass123");
//
//        Map<String, Object> userRow = Map.of(
//            "user_id", 1,
//            "password", "$2a$10$hashed",
//            "role", "USER",
//            "status", "Active",
//            "full_name", "Akshitha"
//        );
//
//        when(jdbcTemplate.queryForMap(anyString(), eq("user1"))).thenReturn(userRow);
//        when(passwordEncoder.matches(eq("pass123"), anyString())).thenReturn(true);
//        when(tokenProvider.createAccessToken(any(), any(), any())).thenReturn("access-token");
//        when(tokenProvider.createRefreshToken(any())).thenReturn("refresh-token");
//
//        mockMvc.perform(post("/api/auth/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(login)))
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$.message").value("Login Successful"))
//            .andExpect(jsonPath("$.accessToken").value("access-token"));
//    }
//}