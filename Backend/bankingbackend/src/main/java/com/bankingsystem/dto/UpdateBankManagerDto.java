package com.bankingsystem.dto;
public class UpdateBankManagerDto {
    private String username;
    private String password;
    private String role;
    private Integer branchId;
    private String fullName;
    private String email;
    private String phone;
    private String status;

    // getters + setters
    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public String getPassword() { return password; }
    public void setPassword(String p) { this.password = p; }
    public String getRole() { return role; }
    public void setRole(String r) { this.role = r; }
    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer b) { this.branchId = b; }
    public String getFullName() { return fullName; }
    public void setFullName(String f) { this.fullName = f; }
    public String getEmail() { return email; }
    public void setEmail(String e) { this.email = e; }
    public String getPhone() { return phone; }
    public void setPhone(String p) { this.phone = p; }
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
}