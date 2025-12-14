package com.bankingsystem.dto;
public class CreateSubsequentAccountDto {
    private Integer customerId;
    private String accountNo;
    private String type; 
    private Double amount;
    private Double interestRate;
    private String startDate;
    private String maturityDate;
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getMaturityDate() { return maturityDate; }
    public void setMaturityDate(String maturityDate) { this.maturityDate = maturityDate; }
}
