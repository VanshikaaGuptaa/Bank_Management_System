package com.bankingsystem.dto;

public class TransactionFilterDto {

    private String accNo;
    private String fromDate;
    private String toDate;

    public String getAccNo() { return accNo; }
    public void setAccNo(String accNo) { this.accNo = accNo; }

    public String getFromDate() { return fromDate; }
    public void setFromDate(String fromDate) { this.fromDate = fromDate; }

    public String getToDate() { return toDate; }
    public void setToDate(String toDate) { this.toDate = toDate; }
}

