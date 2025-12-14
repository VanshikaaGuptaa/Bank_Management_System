package com.bankingsystem.dto;

public class BankManagerDto {
	// Bank Manager fields
	private Integer bmId;
	private Integer userId;
	private Integer branchId;
	private Boolean approvedByRm;
	private String remarks;

	// User fields
	private String username;
	private String password;
	private String email;
	private String phone;
	private String fullName;
	private String role;
	private String status; // Active, Inactive
	private String uploadedDocs;
	private byte[] profileImage;

	public BankManagerDto() {
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private Integer bmId;
		private Integer userId;
		private Integer branchId;
		private Boolean approvedByRm;
		private String remarks;
		private String username;
		private String password;
		private String email;
		private String phone;
		private String fullName;
		private String role;
		private String status;
		private String uploadedDocs;
		private byte[] profileImage;

		public Builder bmId(Integer bmId) {
			this.bmId = bmId;
			return this;
		}

		public Builder userId(Integer userId) {
			this.userId = userId;
			return this;
		}

		public Builder branchId(Integer branchId) {
			this.branchId = branchId;
			return this;
		}

		public Builder approvedByRm(Boolean approvedByRm) {
			this.approvedByRm = approvedByRm;
			return this;
		}

		public Builder remarks(String remarks) {
			this.remarks = remarks;
			return this;
		}

		public Builder username(String username) {
			this.username = username;
			return this;
		}

		public Builder password(String password) {
			this.password = password;
			return this;
		}

		public Builder email(String email) {
			this.email = email;
			return this;
		}

		public Builder phone(String phone) {
			this.phone = phone;
			return this;
		}

		public Builder fullName(String fullName) {
			this.fullName = fullName;
			return this;
		}

		public Builder role(String role) {
			this.role = role;
			return this;
		}

		public Builder status(String status) {
			this.status = status;
			return this;
		}

		public Builder uploadedDocs(String uploadedDocs) {
			this.uploadedDocs = uploadedDocs;
			return this;
		}

		public Builder profileImage(byte[] profileImage) {
			this.profileImage = profileImage;
			return this;
		}

		public BankManagerDto build() {
			BankManagerDto dto = new BankManagerDto();
			dto.setBmId(bmId);
			dto.setUserId(userId);
			dto.setBranchId(branchId);
			dto.setApprovedByRm(approvedByRm);
			dto.setRemarks(remarks);
			dto.setUsername(username);
			dto.setPassword(password);
			dto.setEmail(email);
			dto.setPhone(phone);
			dto.setFullName(fullName);
			dto.setRole(role);
			dto.setStatus(status);
			dto.setUploadedDocs(uploadedDocs);
			dto.setProfileImage(profileImage);
			return dto;
		}
	}

	// Getters & Setters
	public Integer getBmId() {
		return bmId;
	}

	public void setBmId(Integer bmId) {
		this.bmId = bmId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getBranchId() {
		return branchId;
	}

	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}

	public Boolean getApprovedByRm() {
		return approvedByRm;
	}

	public void setApprovedByRm(Boolean approvedByRm) {
		this.approvedByRm = approvedByRm;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
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

	public String getUploadedDocs() {
		return uploadedDocs;
	}

	public void setUploadedDocs(String uploadedDocs) {
		this.uploadedDocs = uploadedDocs;
	}

	public byte[] getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(byte[] profileImage) {
		this.profileImage = profileImage;
	}
}
