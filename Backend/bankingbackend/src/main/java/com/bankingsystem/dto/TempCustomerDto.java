package com.bankingsystem.dto;

public class TempCustomerDto {

    private Integer tempCustId;
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private String address;
    private String status;
    private Integer branchId;
    private java.sql.Timestamp createdAt;
    private String uploadedDocs;     // if stored as JSON / text
    private byte[] profileImage;     // optional

    // getters & setters

    public Integer getTempCustId() { return tempCustId; }
    public void setTempCustId(Integer tempCustId) { this.tempCustId = tempCustId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer branchId) { this.branchId = branchId; }

    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }

    public String getUploadedDocs() { return uploadedDocs; }
    public void setUploadedDocs(String uploadedDocs) { this.uploadedDocs = uploadedDocs; }

    public byte[] getProfileImage() { return profileImage; }
    public void setProfileImage(byte[] profileImage) { this.profileImage = profileImage; }
}
