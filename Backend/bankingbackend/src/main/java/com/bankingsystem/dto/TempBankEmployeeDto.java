package com.bankingsystem.dto;

import java.sql.Timestamp;

public class TempBankEmployeeDto {
    private Integer tempBeId;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private String status;
    private Integer branchId;
    private Integer managerId;
    private Timestamp createdAt;
    private String UploadedDocs;
    private byte[] profileImage;
	public TempBankEmployeeDto(Integer tempBeId, String username, String password, String email, String phone,
			String fullName, String role, String status, Integer branchId, Integer managerId, Timestamp createdAt,
			String uploadedDocs, byte[] profileImage) {
		super();
		this.tempBeId = tempBeId;
		this.username = username;
		this.password = password;
		this.email = email;
		this.phone = phone;
		this.fullName = fullName;
		this.role = role;
		this.status = status;
		this.branchId = branchId;
		this.managerId = managerId;
		this.createdAt = createdAt;
		UploadedDocs = uploadedDocs;
		this.profileImage = profileImage;
	}
	public TempBankEmployeeDto() {
		super();
	}
	public Integer getTempBeId() {
		return tempBeId;
	}
	public void setTempBeId(Integer tempBeId) {
		this.tempBeId = tempBeId;
	}
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
	public Integer getManagerId() {
		return managerId;
	}
	public void setManagerId(Integer managerId) {
		this.managerId = managerId;
	}
	public Timestamp getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}
	public String getUploadedDocs() {
		return UploadedDocs;
	}
	public void setUploadedDocs(String uploadedDocs) {
		UploadedDocs = uploadedDocs;
	}
	public byte[] getProfileImage() {
		return profileImage;
	}
	public void setProfileImage(byte[] profileImage) { this.profileImage = profileImage; }
	
    
	
}
