package com.bankingsystem.dto;

public class DepositWithdrawDto {

    private String accNo;
    private Double amount;
    private String remarks;

    public String getAccNo() { return accNo; }
    public void setAccNo(String accNo) { this.accNo = accNo; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}