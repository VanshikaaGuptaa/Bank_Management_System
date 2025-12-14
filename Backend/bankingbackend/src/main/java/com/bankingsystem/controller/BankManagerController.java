package com.bankingsystem.controller;

import com.bankingsystem.dto.CreateBankManagerDto;
import com.bankingsystem.dto.TempBankEmployeeDto;
import com.bankingsystem.dto.TempLoanDto;
import com.bankingsystem.dto.UpdateBankManagerDto;
import com.bankingsystem.entity.BankManager;
import com.bankingsystem.entity.Loan;
import com.bankingsystem.service.BankManagerService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bank-managers")
public class BankManagerController {

	private final BankManagerService service;

	public BankManagerController(BankManagerService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<BankManager>> getAll() {
		return ResponseEntity.ok(service.getAllBM());
	}

	@GetMapping("/{id}")
	public ResponseEntity<BankManager> getOne(@PathVariable("id") int id) {
		return ResponseEntity.ok(service.getBMById(id));
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody CreateBankManagerDto dto) {
		Integer created = service.createBM(dto);
		return ResponseEntity.status(201).body("{\"bmId\": " + created + "}");
	}

	@PutMapping(value = "/{id}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateProfile(@PathVariable("id") Integer id,
			@RequestParam(required = false) String username, @RequestParam(required = false) String fullName,
			@RequestParam(required = false) String email, @RequestParam(required = false) String phone,
			@RequestParam(required = false) String address,
			@RequestPart(value = "image", required = false) MultipartFile image) {
		boolean ok = service.updateProfile(id, username, fullName, email, phone, address, image);
		return ResponseEntity.ok(Map.of("updated", ok));
	}

	@GetMapping("/{id}/profile-image")
	public ResponseEntity<byte[]> getProfileImage(@PathVariable("id") Integer id) {
		byte[] image = service.getProfileImageBytes(id);
		if (image == null || image.length == 0)
			return ResponseEntity.notFound().build();
		// detect content type if you store — here default to jpeg
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE).body(image);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody UpdateBankManagerDto dto) {
		boolean ok = service.updateBM(id, dto);
		return ResponseEntity.ok().body("{\"updated\": " + ok + "}");
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		boolean ok = service.deleteBM(id);
		return ResponseEntity.ok().body("{\"deleted\": " + ok + "}");
	}

	@PostMapping("/{id}/approve")
	public ResponseEntity<?> approve(@PathVariable("id") int id) {
		Integer ok = service.approveBE(id);
		return ResponseEntity.ok().body("{\"approved\": " + ok + "}");
	}

	@GetMapping("/temp-bank-employees/{bmId}")
	public ResponseEntity<List<TempBankEmployeeDto>> getTempBankEmployees(@PathVariable Integer bmId) {
		List<TempBankEmployeeDto> list = service.getTempBankEmployeesForCurrentBM(bmId);
		return ResponseEntity.ok(list);
	}

	@PostMapping("/{tempId}/disapprove")
	public ResponseEntity<?> dispproveTempBE(@PathVariable("tempId") int tempBeId) {
		service.disapproveBE(tempBeId);
		return ResponseEntity.ok().body(Map.of("disapproved", true));
	}

	@PostMapping("/approve-loan/{tempLoanId}")
	public ResponseEntity<?> approveLoan(@RequestParam("userId") int userId,
			@PathVariable("tempLoanId") int tempLoanId) {

		try {
			Integer loanId = service.approveLoan(tempLoanId, userId);
			return ResponseEntity.ok(Map.of("loanId", loanId, "message", "Loan approved"));
		} catch (RuntimeException ex) {
			return ResponseEntity.status(500).body(Map.of("error", "Database error", "details", ex.getMessage()));
		}
	}

	@PostMapping("/disapprove-loan/{tempLoanId}")
	public ResponseEntity<?> disapproveLoan(@PathVariable("tempLoanId") int tempLoanId) {

		try {
			boolean loanId = service.disapproveLoan(tempLoanId);
			return ResponseEntity.ok(Map.of("loanId", loanId, "message", "Loan disapproved"));
		} catch (RuntimeException ex) {
			return ResponseEntity.status(500).body(Map.of("error", "Database error", "details", ex.getMessage()));
		}
	}

	@GetMapping("/pending-loans")
	public ResponseEntity<List<TempLoanDto>> getPendingLoans() {
		List<TempLoanDto> list = service.getPendingLoans();
		return ResponseEntity.ok(service.getPendingLoans());
	}
}
