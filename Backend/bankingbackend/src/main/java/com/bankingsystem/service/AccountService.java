package com.bankingsystem.service;

import com.bankingsystem.dto.CloseAccountRequestDto;
import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.DepositWithdrawDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.Transaction;

import java.util.List;

public interface AccountService {

    Account createAccount(CreateAccountDto dto);

    Account getByAccNo(String accNo);

    List<Account> getByCustomer(Integer custId);

    Double deposit(DepositWithdrawDto dto);

    Double withdraw(DepositWithdrawDto dto);

    boolean closeAccount(CloseAccountRequestDto request);

    List<Transaction> getMiniStatement(String accNo);

    List<Transaction> getStatement(String accNo, String fromDate, String toDate);

	Account createAccountByEmployee(CreateAccountDto dto);
	
	void transfer(String fromAcc , String toAcc , Double amount);

	List<Account> getAccountSummaryReport();
}

