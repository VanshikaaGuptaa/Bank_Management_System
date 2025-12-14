package com.bankingsystem.dto;

public class CreateBranchDto {
	private String branch_name;
	private String branch_code;
	private String address;
	private String type;
	private int rmid;
	public CreateBranchDto() {
		super();
	}
	public CreateBranchDto(String branch_name, String branch_code, String address, String type, int rmid) {
		super();
		this.branch_name = branch_name;
		this.branch_code = branch_code;
		this.address = address;
		this.type = type;
		this.rmid = rmid;
	}
	public String getBranch_name() {
		return branch_name;
	}
	public void setBranch_name(String branch_name) {
		this.branch_name = branch_name;
	}
	public String getBranch_code() {
		return branch_code;
	}
	public void setBranch_code(String branch_code) {
		this.branch_code = branch_code;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getrmid() {
		return rmid;
	}
	public void setRmid(int rmid) {
		this.rmid = rmid;
	}
	

}
