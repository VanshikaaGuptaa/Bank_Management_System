package com.bankingsystem.service.impl;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bankingsystem.dto.TransactionFilterDto;
//import com.bankingsystem.entity.Transaction;
import com.bankingsystem.entity.Transaction;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Timestamp;
import java.util.*;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class TransactionServiceImplTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private Transaction sampleTransaction;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleTransaction = new Transaction();
        sampleTransaction.setTransId(1);
        sampleTransaction.setAccNo("ACC123");
        sampleTransaction.setTransType("DEPOSIT");
        sampleTransaction.setAmount(1000.0);
        sampleTransaction.setTransDate(Timestamp.valueOf("2025-12-01 10:00:00"));
        sampleTransaction.setRemarks("Initial deposit");
        sampleTransaction.setBalanceAfter(1000.0);
    }

    @SuppressWarnings("unchecked")
	@Test
    void testGetAll() {
        when(jdbcTemplate.query(anyString(), any(RowMapper.class))).thenReturn(List.of(sampleTransaction));
        List<Transaction> result = transactionService.getAll();
        assertEquals(1, result.size());
        assertEquals("ACC123", result.get(0).getAccNo());
    }

    @SuppressWarnings("unchecked")
	@Test
    void testGetByAccNo() {
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq("ACC123"))).thenReturn(List.of(sampleTransaction));
        List<Transaction> result = transactionService.getByAccNo("ACC123");
        assertEquals(1, result.size());
        assertEquals("DEPOSIT", result.get(0).getTransType());
    }

    @SuppressWarnings({"unchecked" })
    @Test
    void testGetMiniStatement() {
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq("ACC123"))).thenReturn(List.of(sampleTransaction));
        List<Transaction> result = transactionService.getMiniStatement("ACC123");
        assertEquals(1, result.size());
        assertEquals(1000.0, result.get(0).getAmount());
    }

    @SuppressWarnings("unchecked")
	@Test
    void testGetStatement() {
        TransactionFilterDto dto = new TransactionFilterDto();
        dto.setAccNo("ACC123");
        dto.setFromDate("2025-12-01");
        dto.setToDate("2025-12-05");

        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq("ACC123"), eq("2025-12-01"), eq("2025-12-05")))
            .thenReturn(List.of(sampleTransaction));

        List<Transaction> result = transactionService.getStatement(dto);
        assertEquals(1, result.size());
        assertEquals("Initial deposit", result.get(0).getRemarks());
    }

    @SuppressWarnings("unchecked")
	@Test
    void testGetTransactionTrends_weekly() {
        Map<String, Object> trend = new HashMap<>();
        trend.put("label", "2025-W49");
        trend.put("count", 1);
        trend.put("totalAmount", 1000.0);

        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq("2025-12-01"), eq("2025-12-05")))
            .thenReturn(List.of(trend));

        List<Map<String, Object>> result = transactionService.getTransactionTrends("2025-12-01", "2025-12-05", "weekly");
        assertEquals(1, result.size());
        assertEquals("2025-W49", result.get(0).get("label"));
    }
}