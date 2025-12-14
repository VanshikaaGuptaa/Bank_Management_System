package com.bankingsystem.controller;

import com.bankingsystem.dto.CreateLoanDto;
import com.bankingsystem.dto.EmiPaymentDto;
import com.bankingsystem.dto.LoanDecisionDto;
import com.bankingsystem.entity.Loan;
import com.bankingsystem.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService service;

    public LoanController(LoanService service) {
        this.service = service;
    }

    @PostMapping("/apply")
    public ResponseEntity<Loan> apply(@RequestBody CreateLoanDto dto) {
        return ResponseEntity.ok(service.applyLoan(dto));
    }

    @PutMapping("/decide")
    public ResponseEntity<Loan> decide(@RequestBody LoanDecisionDto dto) {
        return ResponseEntity.ok(service.decideLoan(dto));
    }

    @PostMapping("/pay-emi")
    public ResponseEntity<Loan> payEmi(@RequestBody EmiPaymentDto dto) {
        return ResponseEntity.ok(service.payEmi(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/customer/{custId}")
    public ResponseEntity<List<Loan>> byCustomer(@PathVariable Integer custId) {
        return ResponseEntity.ok(service.getByCustomer(custId));
    }

    @GetMapping
    public ResponseEntity<List<Loan>> all() {
        return ResponseEntity.ok(service.getAll());
    }
    @GetMapping("/report/status")
    public ResponseEntity<List<CreateLoanDto>> getLoanStatusReport() {
        return ResponseEntity.ok(service.getLoanStatusReport());
    }
}


