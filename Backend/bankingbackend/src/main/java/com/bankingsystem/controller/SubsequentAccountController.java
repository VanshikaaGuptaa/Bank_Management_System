package com.bankingsystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bankingsystem.dto.CreateSubsequentAccountDto;
import com.bankingsystem.entity.SubsequentAccount;
import com.bankingsystem.service.SubsequentAccountService;

@RestController

@RequestMapping("/api/subsequent")

public class SubsequentAccountController {

	private final SubsequentAccountService service;

	public SubsequentAccountController(SubsequentAccountService service) {

		this.service = service;

	}

	@PostMapping("/create")

	public ResponseEntity<SubsequentAccount> create(@RequestBody CreateSubsequentAccountDto dto) {

		return ResponseEntity.ok(service.create(dto));

	}

	@GetMapping("/{id}")

	public ResponseEntity<SubsequentAccount> getById(@PathVariable Integer id) {

		SubsequentAccount acc = service.getById(id);

		return acc != null ? ResponseEntity.ok(acc) : ResponseEntity.notFound().build();

	}

	@GetMapping("/all")

	public List<SubsequentAccount> getAll() {

		return service.getAll();

	}

	@PostMapping("/deposit/{id}")

	public ResponseEntity<SubsequentAccount> deposit(@PathVariable Integer id, @RequestParam Double amount) {

		return ResponseEntity.ok(service.deposit(id, amount));

	}

	@PostMapping("/withdraw/{id}")

	public ResponseEntity<SubsequentAccount> withdraw(@PathVariable Integer id, @RequestParam Double amount) {

		return ResponseEntity.ok(service.withdraw(id, amount));

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Integer id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/soft-delete/{id}")
	public ResponseEntity<Void> softDelete(@PathVariable Integer id, @RequestParam Integer performedBy) {
		service.softDelete(id, performedBy);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/restore/{id}")
	public ResponseEntity<Void> restore(@PathVariable Integer id) {
		service.restore(id);
		return ResponseEntity.ok().build();
	}
}