package com.bankingsystem.dto;

public class CloseAccountRequestDto {
    private String accNo;   // account number
    private Integer custId; // owner id

    public String getAccNo() { return accNo; }
    public void setAccNo(String accNo) { this.accNo = accNo; }

    public Integer getCustId() { return custId; }
    public void setCustId(Integer custId) { this.custId = custId; }
}
