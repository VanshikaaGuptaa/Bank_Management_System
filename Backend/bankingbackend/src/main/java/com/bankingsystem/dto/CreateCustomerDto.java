package com.bankingsystem.dto;

public class CreateCustomerDto {

    // USER fields
    private String username;
    private String password; // temporary password given by BE
    private String email;
    private String phone;
    private String fullName;

    // CUSTOMER fields
    private Integer branchId;
    private Integer createdByBe; // bank_employee id

    // ACCOUNT fields (basic)
    private String accType; // "Saving" / "Current"
    private String accStatus;
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
	public Integer getBranchId() {
		return branchId;
	}
	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}
	public Integer getCreatedByBe() {
		return createdByBe;
	}
	public void setCreatedByBe(Integer createdByBe) {
		this.createdByBe = createdByBe;
	}
	public String getAccType() {
		return accType;
	}
	public void setAccType(String accType) {
		this.accType = accType;
	}
	public String getAccStatus() {
		return accStatus;
	}
	public void setAccStatus(String accStatus) {
		this.accStatus = accStatus;
	} // "Active"
}
  
    