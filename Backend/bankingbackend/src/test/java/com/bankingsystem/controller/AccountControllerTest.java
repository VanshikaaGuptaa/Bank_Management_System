package com.bankingsystem.controller;

import com.bankingsystem.BankingSystem.BankingSystemApplication;
import com.bankingsystem.dto.CloseAccountRequestDto;
import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.DepositWithdrawDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.Transaction;
import com.bankingsystem.service.AccountService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(classes = BankingSystemApplication.class)
@AutoConfigureMockMvc
public class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    private ObjectMapper objectMapper;

    private CreateAccountDto createDto;
    private DepositWithdrawDto depositDto;
    private CloseAccountRequestDto closeDto;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();

        createDto = new CreateAccountDto();
        createDto.setCustId(1);
        createDto.setAccType("Saving");

        depositDto = new DepositWithdrawDto();
        depositDto.setAccNo("AC123");
        depositDto.setAmount(1000.0);
//        depositDto.setTransDate(Date.valueOf(LocalDate.now()));
        depositDto.setRemarks("Deposit");

        closeDto = new CloseAccountRequestDto();
        closeDto.setAccNo("AC123");
        closeDto.setCustId(1);
    }

    @WithMockUser
    @Test
    void testCreateAccount_success() throws Exception {
        Account acc = new Account();
        acc.setAccNo("AC123");

        when(accountService.createAccount(any(CreateAccountDto.class))).thenReturn(acc);

        mockMvc.perform(post("/api/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accNo").value("AC123"));
    }

    @WithMockUser(username = "testuser", roles = {"USER"})
    @Test
    void testDeposit_success() throws Exception {
        when(accountService.deposit(any(DepositWithdrawDto.class))).thenReturn(6000.0);

        mockMvc.perform(post("/api/accounts/deposit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(depositDto)))
            .andExpect(status().isOk())
            .andExpect(content().string("6000.0"));
    }

    @WithMockUser
    @Test
    void testWithdraw_success() throws Exception {
        when(accountService.withdraw(any(DepositWithdrawDto.class))).thenReturn(4000.0);

        mockMvc.perform(post("/api/accounts/withdraw")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(depositDto)))
            .andExpect(status().isOk())
            .andExpect(content().string("4000.0"));
    }

    @WithMockUser
    @Test
    void testCloseAccount_success() throws Exception {
        when(accountService.closeAccount(any(CloseAccountRequestDto.class))).thenReturn(true);

        mockMvc.perform(post("/api/accounts/close")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(closeDto)))
            .andExpect(status().isOk())
            .andExpect(content().string("Account Closed Successfully"));
    }

    @WithMockUser
    @Test
    void testGetAccountSummaryReport_success() throws Exception {
        Account acc = new Account();
        acc.setAccNo("AC123");
        acc.setAccType("Saving");
        acc.setBalance(5000.0);

        when(accountService.getAccountSummaryReport()).thenReturn(List.of(acc));

        mockMvc.perform(get("/api/accounts/reports/account-summary"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].accNo").value("AC123"))
            .andExpect(jsonPath("$[0].balance").value(5000.0));
    }
}
