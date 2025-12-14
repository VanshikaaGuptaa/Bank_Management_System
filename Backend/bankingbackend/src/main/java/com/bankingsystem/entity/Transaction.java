package com.bankingsystem.entity;

import java.sql.Timestamp;

public class Transaction {

    private Integer transId;
    private String accNo;
    private String transType; // "Credit" / "Debit"
    private Double amount;
    private Timestamp transDate;
    private String remarks;
    private Double balanceAfter;

    public Transaction() {}

    public Integer getTransId() { return transId; }
    public void setTransId(Integer transId) { this.transId = transId; }

    public String getAccNo() { return accNo; }
    public void setAccNo(String accNo) { this.accNo = accNo; }

    public String getTransType() { return transType; }
    public void setTransType(String transType) { this.transType = transType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Timestamp getTransDate() { return transDate; }
    public void setTransDate(Timestamp transDate) { this.transDate = transDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Double getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Double balanceAfter) { this.balanceAfter = balanceAfter; }
}
