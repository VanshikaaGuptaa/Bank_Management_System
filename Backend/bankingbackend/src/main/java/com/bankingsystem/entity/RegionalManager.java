package com.bankingsystem.entity;

public class RegionalManager {
    private Integer rmId;
    private String address;
    private Integer userId;

    // user fields for joined responses
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private String status;

    public RegionalManager() {}

    // getters & setters...
    public Integer getRmId() { return rmId; }
    public void setRmId(Integer rmId) { this.rmId = rmId; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
