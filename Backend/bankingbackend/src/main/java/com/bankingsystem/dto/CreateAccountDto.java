package com.bankingsystem.dto;

public class CreateAccountDto {

    private Integer custId;
    private String accType; // Saving / Current / RD / FD

    public Integer getCustId() { return custId; }
    public void setCustId(Integer custId) { this.custId = custId; }

    public String getAccType() { return accType; }
    public void setAccType(String accType) { this.accType = accType; }
}

