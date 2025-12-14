package com.bankingsystem.service;

import com.bankingsystem.dto.CreateLoanDto;
import com.bankingsystem.dto.EmiPaymentDto;
import com.bankingsystem.dto.LoanDecisionDto;
import com.bankingsystem.entity.Loan;

import java.util.List;

public interface LoanService {

    Loan applyLoan(CreateLoanDto dto);

    Loan decideLoan(LoanDecisionDto dto); // approve or reject

    Loan payEmi(EmiPaymentDto dto);

    Loan getById(Integer loanId);

    List<Loan> getByCustomer(Integer custId);

    List<Loan> getAll();

	List<CreateLoanDto> getLoanStatusReport();
}
