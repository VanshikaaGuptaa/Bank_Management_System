package com.bankingsystem.dto;

public class CreateBankEmployeeDto {

    // user fields
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private String status;
    private Boolean approvedByBm;
    private Integer branchId;

    public CreateBankEmployeeDto() {}

    // getters & setters
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

    public Boolean getApprovedByBm() { return approvedByBm; }
    public void setApprovedByBm(Boolean approvedByBm) { this.approvedByBm = approvedByBm; }

    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer branchId) { this.branchId = branchId; }
}


