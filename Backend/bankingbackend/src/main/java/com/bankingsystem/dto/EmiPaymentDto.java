package com.bankingsystem.dto;

public class EmiPaymentDto {

    private Integer loanId;
    private Double amount;

    public Integer getLoanId() { return loanId; }
    public void setLoanId(Integer loanId) { this.loanId = loanId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
