package com.bankingsystem.dto;

public class LoanDecisionDto {
    private Integer loanId;
    private Integer bmId;
    private boolean approve; // true=approve, false=reject

    public Integer getLoanId() { return loanId; }
    public void setLoanId(Integer loanId) { this.loanId = loanId; }

    public Integer getBmId() { return bmId; }
    public void setBmId(Integer bmId) { this.bmId = bmId; }

    public boolean isApprove() { return approve; }
    public void setApprove(boolean approve) { this.approve = approve; }
}
