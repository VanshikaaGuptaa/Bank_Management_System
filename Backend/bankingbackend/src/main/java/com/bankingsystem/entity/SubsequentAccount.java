package com.bankingsystem.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SubsequentAccount {

    private Integer subAccId;
    private String accountNo;
    private Integer customerId;
    private String type; 
    private Double amount;
    private Double interestRate;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private String status;
    private LocalDateTime createdAt;
    private Integer deletedBy;
    private LocalDateTime deletedAt;

    public Integer getSubAccId() { return subAccId; }
    public void setSubAccId(Integer subAccId) { this.subAccId = subAccId; }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getMaturityDate() { return maturityDate; }
    public void setMaturityDate(LocalDate maturityDate) { this.maturityDate = maturityDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Integer getdeletedBy() { return deletedBy; }
    public void setDeletedBy(Integer deletedBy) { this.deletedBy = deletedBy; }
    
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
