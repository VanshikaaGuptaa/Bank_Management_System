package com.bankingsystem.controller;

import com.bankingsystem.dto.TransactionFilterDto;
import com.bankingsystem.entity.Transaction;
import com.bankingsystem.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> all() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/account/{accNo}")
    public ResponseEntity<List<Transaction>> getByAcc(@PathVariable String accNo) {
        return ResponseEntity.ok(service.getByAccNo(accNo));
    }

    @GetMapping("/mini/{accNo}")
    public ResponseEntity<List<Transaction>> getMini(@PathVariable String accNo) {
        return ResponseEntity.ok(service.getMiniStatement(accNo));
    }

    @PostMapping("/statement")
    public ResponseEntity<List<Transaction>> getStatement(@RequestBody TransactionFilterDto dto) {
        return ResponseEntity.ok(service.getStatement(dto));
    }
    @GetMapping("/report/trends")
    public ResponseEntity<List<Map<String, Object>>> getTrends(
            @RequestParam String fromDate,
            @RequestParam String toDate,
            @RequestParam String trendType) {
        return ResponseEntity.ok(service.getTransactionTrends(fromDate, toDate, trendType));
    }
}