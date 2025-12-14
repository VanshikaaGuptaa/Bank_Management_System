package com.bankingsystem.entity;

import java.sql.Date;

public class Loan {

    private Integer loanId;
    private Integer custId;
    private Integer bmId;
    private Double amount;
    private String status; // Pending/Approved/Rejected/Closed
    private Date issueDate;
    private Double interestRate;
    private Integer tenureMonths;
    private String loanType;
    private Double emiAmount;
    private Integer totalEmis;
    private Integer paidEmis;
    private Date nextPaymentDate;
    private Date lastPaymentDate;
    private Double remainingAmount;
    private String emiFrequency; // MONTHLY etc.
    private String loanStatus; // New/Ongoing/Completed/Rejected

    public Loan() {}

    // getters & setters

    public Integer getLoanId() { return loanId; }
    public void setLoanId(Integer loanId) { this.loanId = loanId; }

    public Integer getCustId() { return custId; }
    public void setCustId(Integer custId) { this.custId = custId; }

    public Integer getBmId() { return bmId; }
    public void setBmId(Integer bmId) { this.bmId = bmId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public Double getEmiAmount() { return emiAmount; }
    public void setEmiAmount(Double emiAmount) { this.emiAmount = emiAmount; }

    public Integer getTotalEmis() { return totalEmis; }
    public void setTotalEmis(Integer totalEmis) { this.totalEmis = totalEmis; }

    public Integer getPaidEmis() { return paidEmis; }
    public void setPaidEmis(Integer paidEmis) { this.paidEmis = paidEmis; }

    public Date getNextPaymentDate() { return nextPaymentDate; }
    public void setNextPaymentDate(Date nextPaymentDate) { this.nextPaymentDate = nextPaymentDate; }

    public Date getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(Date lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }

    public Double getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(Double remainingAmount) { this.remainingAmount = remainingAmount; }

    public String getEmiFrequency() { return emiFrequency; }
    public void setEmiFrequency(String emiFrequency) { this.emiFrequency = emiFrequency; }

    public String getLoanStatus() { return loanStatus; }
    public void setLoanStatus(String loanStatus) { this.loanStatus = loanStatus; }
}

