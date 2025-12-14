package com.bankingsystem.service;

import com.bankingsystem.dto.TransactionFilterDto;
import com.bankingsystem.entity.Transaction;

import java.util.List;
import java.util.Map;

public interface TransactionService {

    List<Transaction> getAll();

    List<Transaction> getByAccNo(String accNo);

    List<Transaction> getMiniStatement(String accNo);

    List<Transaction> getStatement(TransactionFilterDto dto);

    Transaction getById(Integer id);

    List<Map<String, Object>> getTransactionTrends(String fromDate, String toDate, String trendType);
}