package com.bankingsystem.controller;
//package com.bankingsystem.controller;
 
import com.bankingsystem.BankingSystem.BankingSystemApplication;
import com.bankingsystem.dto.CreateSubsequentAccountDto;
import com.bankingsystem.entity.SubsequentAccount;
import com.bankingsystem.service.SubsequentAccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
 
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
 
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
 
 
@SpringBootTest(classes = BankingSystemApplication.class)
@AutoConfigureMockMvc
@WithMockUser(username = "testuser", roles = "ADMIN")
class SubsequentAccountControllerTest {
 
    @Autowired
    private MockMvc mockMvc;
 
    @MockBean
    private SubsequentAccountService service;

    private SubsequentAccount sampleAccount() {
        SubsequentAccount acc = new SubsequentAccount();
        acc.setSubAccId(1);
        acc.setAccountNo("ACC123");
        acc.setCustomerId(101);
        acc.setType("FD");
        acc.setAmount(5000.0);
        acc.setInterestRate(6.5);
        acc.setStartDate(LocalDate.of(2025, 12, 1));
        acc.setMaturityDate(LocalDate.of(2026, 12, 1));
        acc.setStatus("ACTIVE");
        acc.setCreatedAt(LocalDateTime.now());
        return acc;
    }
 

    @Test
    void testCreateAccount() throws Exception {
        when(service.create(any(CreateSubsequentAccountDto.class))).thenReturn(sampleAccount());
 
        mockMvc.perform(post("/api/subsequent/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "accountNo": "ACC123",
                      "customerId": 101,
                      "type": "FD",
                      "amount": 5000.0,
                      "interestRate": 6.5,
                      "startDate": "2025-12-01",
                      "maturityDate": "2026-12-01"
                    }
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNo").value("ACC123"));
    }
 

    @Test
    void testGetById() throws Exception {
        when(service.getById(1)).thenReturn(sampleAccount());
 
        mockMvc.perform(get("/api/subsequent/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subAccId").value(1));
    }
 

    @Test
    void testGetAllAccounts() throws Exception {
        when(service.getAll()).thenReturn(List.of(sampleAccount()));
 
        mockMvc.perform(get("/api/subsequent/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].accountNo").value("ACC123"));
    }
 

    @Test
    void testDeposit() throws Exception {
        when(service.deposit(eq(1), eq(1000.0))).thenReturn(sampleAccount());
 
        mockMvc.perform(post("/api/subsequent/deposit/1")
                .param("amount", "1000.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(5000.0));
    }
 

    @Test
    void testSoftDelete() throws Exception {
        doNothing().when(service).softDelete(eq(1), eq(999));
 
        mockMvc.perform(put("/api/subsequent/soft-delete/1")
                .param("performedBy", "999"))
                .andExpect(status().isOk());
    }
 

    @Test
    void testDepositZeroAmount() throws Exception {
        when(service.deposit(eq(1), eq(0.0)))
                .thenThrow(new RuntimeException("Deposit amount must be positive"));
 
        mockMvc.perform(post("/api/subsequent/deposit/1")
                .param("amount", "0.0"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Deposit amount must be positive")));
    }
 

    @Test
    void testWithdrawInsufficientBalance() throws Exception {
        when(service.withdraw(eq(1), eq(10000.0)))
                .thenThrow(new RuntimeException("Insufficient balance"));
 
        mockMvc.perform(post("/api/subsequent/withdraw/1")
                .param("amount", "10000.0"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Insufficient balance")));
    }
 

    @Test
    void testDeleteAccountWithBalance() throws Exception {
        doThrow(new RuntimeException("Cannot close account: balance must be zero"))
                .when(service).delete(eq(1));
 
        mockMvc.perform(delete("/api/subsequent/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("balance must be zero")));
    }
 

    @Test
    void testRestoreAlreadyActiveAccount() throws Exception {
        doThrow(new RuntimeException("Account is already active"))
                .when(service).restore(eq(1));
 
        mockMvc.perform(put("/api/subsequent/restore/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("already active")));
    }
 

    @Test
    void testRestoreAccount() throws Exception {
        doNothing().when(service).restore(eq(1));
 
        mockMvc.perform(put("/api/subsequent/restore/1"))
                .andExpect(status().isOk());
    }
 

    @Test
    void testDeleteAccount() throws Exception {
        doNothing().when(service).delete(eq(1));
 
        mockMvc.perform(delete("/api/subsequent/1"))
                .andExpect(status().isNoContent());
    }
}