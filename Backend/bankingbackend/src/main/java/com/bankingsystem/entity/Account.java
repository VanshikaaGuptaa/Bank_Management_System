package com.bankingsystem.entity;

import java.sql.Date;

public class Account {

    private Integer accId;
    private String accNo;
    private Integer custId;
    private String accType;
    private Double balance;
    private Date openedDate;
    private String status;

    public Account() {}

    public Integer getAccId() { return accId; }
    public void setAccId(Integer accId) { this.accId = accId; }

    public String getAccNo() { return accNo; }
    public void setAccNo(String accNo) { this.accNo = accNo; }

    public Integer getCustId() { return custId; }
    public void setCustId(Integer custId) { this.custId = custId; }

    public String getAccType() { return accType; }
    public void setAccType(String accType) { this.accType = accType; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public Date getOpenedDate() { return openedDate; }
    public void setOpenedDate(Date openedDate) { this.openedDate = openedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
