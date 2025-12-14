package com.bankingsystem.dto;

public class UpdateBankEmployeeDto {
    // bank_employee fields
    private Boolean approvedByBm;
    private Integer branchId;

    // optional user fields to update
    private String email;
    private String phone;
    private String fullName;
    private String status;
    private String role;

    public UpdateBankEmployeeDto() {}

    public Boolean getApprovedByBm() { return approvedByBm; }
    public void setApprovedByBm(Boolean approvedByBm) { this.approvedByBm = approvedByBm; }

    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer branchId) { this.branchId = branchId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

	
}
