package com.bankingsystem.dto;

import java.sql.Timestamp;

public class TempBankManagerDto {
    private Integer tempBmId;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private String status;
    private Integer branchId;
    private java.sql.Timestamp createdAt;

    // getters + setters...
    public Integer getTempBmId() { return tempBmId; }
    public void setTempBmId(Integer tempBmId) { this.tempBmId = tempBmId; }

    // ... other getters/setters ...
    

    public Timestamp getCreatedAt() { return createdAt; }
    public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getBranchId() {
		return branchId;
	}
	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}
	public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
