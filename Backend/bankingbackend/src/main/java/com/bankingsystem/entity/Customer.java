package com.bankingsystem.entity;
import com.bankingsystem.entity.User;

public class Customer {
    private Integer custId;
    private Integer createdByBe;
    private Integer userId;
    private Integer branchId;

    public Customer() {}

    public Integer getCustId() { return custId; }
    public void setCustId(Integer custId) { this.custId = custId; }

    public Integer getCreatedByBe() { return createdByBe; }
    public void setCreatedByBe(Integer createdByBe) { this.createdByBe = createdByBe; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer branchId) { this.branchId = branchId; }
    private User user;
    public User getUser() {return user;}
    public void setUser(User user) {
    	this.user = user;}
    }


