package com.bankingsystem.entity;



import java.sql.Timestamp;

public class User {
    private Integer userId;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private String role;   // enum string
    private String status; // enum string
    private Timestamp createdAt;
    private String uploadedDocs; // store JSON as text
    private byte[] profileImage;

    public User() {}

    // getters & setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
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
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public String getUploadedDocs() { return uploadedDocs; }
    public void setUploadedDocs(String uploadedDocs) { this.uploadedDocs = uploadedDocs; }
    public byte[] getProfileImage() { return profileImage; }
    public void setProfileImage(byte[] profileImage) { this.profileImage = profileImage; }
}
