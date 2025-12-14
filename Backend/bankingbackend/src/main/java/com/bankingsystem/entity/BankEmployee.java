
package com.bankingsystem.entity;

public class BankEmployee {

    private Integer beId;
    private Boolean approvedByBm;
    private Integer userId;
    private Integer branchId;

    // optional: user details included in responses
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private String status;

    public BankEmployee() {}

    public Integer getBeId() { return beId; }
    public void setBeId(Integer beId) { this.beId = beId; }

    public Boolean getApprovedByBm() { return approvedByBm; }
    public void setApprovedByBm(Boolean approvedByBm) { this.approvedByBm = approvedByBm; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer branchId) { this.branchId = branchId; }

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
