package com.bankingsystem.dto;

public class TransferDto {
    private String fromAcc;
    private String toAcc;
    private Double amount;

    public String getFromAcc() {
        return fromAcc;
    }

    public void setFromAcc(String fromAcc) {
        this.fromAcc = fromAcc;
    }

    public String getToAcc() {
        return toAcc;
    }

    public void setToAcc(String toAcc) {
        this.toAcc = toAcc;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
