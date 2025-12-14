package com.bankingsystem.dto;

import java.sql.Timestamp;

public class TempLoanDto {

    private Integer tempLoanId;
    private Integer customerId;
    private Double amount;
    private Double interestRate;
    private Integer tenureMonths;
    private String loanType;
    private String emiFrequency;   // If your table contains it
    private String status;
    private Timestamp createdAt;

    // --------- GETTERS & SETTERS ---------
    public Integer getTempLoanId() {
        return tempLoanId;
    }

    public void setTempLoanId(Integer tempLoanId) {
        this.tempLoanId = tempLoanId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public String getEmiFrequency() {
        return emiFrequency;
    }

    public void setEmiFrequency(String emiFrequency) {
        this.emiFrequency = emiFrequency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
