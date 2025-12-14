package com.bankingsystem.service;

import java.util.List;

import com.bankingsystem.dto.CreateSubsequentAccountDto;
import com.bankingsystem.entity.SubsequentAccount;

public interface SubsequentAccountService {

	SubsequentAccount create(CreateSubsequentAccountDto dto);

	SubsequentAccount getById(Integer id);

	List<SubsequentAccount> getAll();

	SubsequentAccount deposit(Integer id, Double amount);

	SubsequentAccount withdraw(Integer id, Double amount);

	void delete(Integer id);
	
	void softDelete(Integer id, Integer performedBy);
	
	void restore(Integer id);

}