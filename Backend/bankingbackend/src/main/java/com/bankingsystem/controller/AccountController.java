package com.bankingsystem.controller;

import com.bankingsystem.dto.CloseAccountRequestDto;
import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.DepositWithdrawDto;
import com.bankingsystem.dto.TransferDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.Transaction;
import com.bankingsystem.service.AccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {
@Autowired

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Account> create(@RequestBody CreateAccountDto dto) {
        return ResponseEntity.ok(service.createAccount(dto));
    }

    @GetMapping("/customer/{custId}")
    public ResponseEntity<List<Account>> byCustomer(@PathVariable Integer custId) {
        return ResponseEntity.ok(service.getByCustomer(custId));
    }

    @PostMapping("/deposit")
    public ResponseEntity<Double> deposit(@RequestBody DepositWithdrawDto dto) {
        return ResponseEntity.ok(service.deposit(dto));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Double> withdraw(@RequestBody DepositWithdrawDto dto) {
        return ResponseEntity.ok(service.withdraw(dto));
    }
    
    @PostMapping("/close")
    public ResponseEntity<?> closeAccount(@RequestBody CloseAccountRequestDto req) {
        try {
            if(service.closeAccount(req))
                return ResponseEntity.ok("Account Closed Successfully");
            return ResponseEntity.badRequest().body("Unable to close account");
        }
        catch (RuntimeException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{accNo}/mini-statement")
    public ResponseEntity<List<Transaction>> mini(@PathVariable String accNo) {
        return ResponseEntity.ok(service.getMiniStatement(accNo));
    }
    @GetMapping("/reports/account-summary")
    public ResponseEntity<List<Account>> getAccountSummaryReport() {
    	List<Account> summary = service.getAccountSummaryReport();
    	return ResponseEntity.ok(summary);
    }
    @GetMapping("/{accNo}/statement")
    public ResponseEntity<List<Transaction>> statement(
            @PathVariable String accNo,
            @RequestParam String from,
            @RequestParam String to) {

        return ResponseEntity.ok(service.getStatement(accNo, from, to));
    }

@PostMapping("/transfer")
public ResponseEntity<String> transfer(@RequestBody TransferDto dto) {
    try {
        service.transfer(dto.getFromAcc(), dto.getToAcc(), dto.getAmount());
        return ResponseEntity.ok("Transfer successful");
    } catch (Exception ex) {
        return ResponseEntity.badRequest().body("Transfer failed: " + ex.getMessage());
    }
}

}