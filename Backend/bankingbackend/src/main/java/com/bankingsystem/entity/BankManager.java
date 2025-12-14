package com.bankingsystem.entity;
import java.sql.Timestamp;

public class BankManager {
    private Integer bmId;
    private Integer userId;
    private Integer branchId;
    private boolean approvedByRm;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String comment;
    private Timestamp createdAt;

    // getters / setters
    public Integer getBmId() { return bmId; }
    public void setBmId(Integer bmId) { this.bmId = bmId; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer uid) { this.userId = uid; }
    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer b) { this.branchId = b; }
    public boolean isApprovedByRm() { return approvedByRm; }
    public void setApprovedByRm(boolean v) { this.approvedByRm = v; }
    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public String getFullName() { return fullName; }
    public void setFullName(String n) { this.fullName = n; }
    public String getEmail() { return email; }
    public void setEmail(String e) { this.email = e; }
    public String getPhone() { return phone; }
    public void setPhone(String p) { this.phone = p; }
    public String getRole() { return role; }
    public void setRole(String r) { this.role = r; }
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public String getComment() { return comment; }
    public void setComment(String c) { this.comment = c; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp t) { this.createdAt = t; }
}