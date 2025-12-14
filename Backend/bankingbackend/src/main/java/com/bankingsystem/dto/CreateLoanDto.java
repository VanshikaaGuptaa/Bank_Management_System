package com.bankingsystem.dto;

import java.sql.Date;

public class CreateLoanDto {

    private Integer custId;
    private Double amount;
    private Double interestRate; 
    private Integer tenureMonths;
    private String loanType;
    private String emiFrequency; 
    private Integer loanId;
    private String loanStatus;
    private String loanProcessStatus;
    private Integer totalEmis;
    private Integer paidEmis;
    private Double remainingAmount;
    private Date issueDate;
    private Date nextPaymentDate;
    private Date lastPaymentDate;
    
    public Integer getCustId() { return custId; }
    public void setCustId(Integer custId) { this.custId = custId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public String getEmiFrequency() { return emiFrequency; }
    public void setEmiFrequency(String emiFrequency) { this.emiFrequency = emiFrequency; }
	
    public Integer getLoanId() { return loanId; }
	public void setLoanId(Integer loanId) { this.loanId = loanId; }
	
	public String getLoanStatus() { return loanStatus; }
	public void setLoanStatus(String loanStatus) { this.loanStatus = loanStatus; }
	
//	public String getLoanProcessStatus() { return loanProcessStatus; }
//	public void setLoanProcessStatus(String loanProcessStatus) { this.loanProcessStatus = loanProcessStatus; }
	
	public Integer getTotalEmis() { return totalEmis; }
	public void setTotalEmis(Integer totalEmis) { this.totalEmis = totalEmis; }
	
	public Integer getPaidEmis() { return paidEmis; }
	public void setPaidEmis(Integer paidEmis) { this.paidEmis = paidEmis; }
	
	public Double getRemainingAmount() { return remainingAmount; }
	public void setRemainingAmount(Double remainingAmount) { this.remainingAmount = remainingAmount; }
	
	public Date getIssueDate() { return issueDate; }
	public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }
	
	public Date getNextPaymentDate() { return nextPaymentDate; }
	public void setNextPaymentDate(Date nextPaymentDate) { this.nextPaymentDate = nextPaymentDate; }
	
	public Date getLastPaymentDate() { return lastPaymentDate; }
	public void setLastPaymentDate(Date lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }
       
}


