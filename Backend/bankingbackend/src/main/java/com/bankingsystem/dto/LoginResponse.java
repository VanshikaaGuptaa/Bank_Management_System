package com.bankingsystem.dto;

public class LoginResponse {
private String message;
private String role;
private Integer userId;
private String fullName;

public LoginResponse(String message, String role, Integer userId, String fullName) {
this.message = message;
this.role = role;
this.userId = userId;
this.fullName = fullName;
}

public String getMessage() { return message; }
public String getRole() { return role; }
public Integer getUserId() { return userId; }
public String getFullName() { return fullName; }
}