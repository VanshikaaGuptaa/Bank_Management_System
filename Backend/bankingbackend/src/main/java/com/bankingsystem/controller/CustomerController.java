package com.bankingsystem.controller;

import com.bankingsystem.dto.ChangePasswordDto;
import com.bankingsystem.dto.CreateCustomerDto;
import com.bankingsystem.entity.Customer;
import com.bankingsystem.entity.User;
import com.bankingsystem.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")

@RequestMapping("/api/customers")
public class CustomerController {

	private final CustomerService customerService;

	public CustomerController(CustomerService customerService) {
		this.customerService = customerService;
	}

	@PostMapping("/create")
	public ResponseEntity<Customer> create(@RequestBody CreateCustomerDto dto) {
		return ResponseEntity.ok(customerService.createCustomer(dto));
	}

	@GetMapping("/report/demographics")
	public ResponseEntity<List<Map<String, Object>>> getDemographics() {
		return ResponseEntity.ok(customerService.getCustomerDemographics());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Customer> get(@PathVariable Integer id) {
		return ResponseEntity.ok(customerService.getCustomerById(id));
	}

	@GetMapping
	public ResponseEntity<List<Customer>> getAll() {
		return ResponseEntity.ok(customerService.getAllCustomers());
	}

	@PutMapping("/{custId}")
	public ResponseEntity<?> updateProfile(@PathVariable Integer custId, @RequestBody User user) {
		return ResponseEntity.ok(customerService.updateProfile(custId, user));
	}

	// first time password change (temp-active)
	@PostMapping("/change-password")
	public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto dto) {
		boolean ok = customerService.changePasswordAndActivate(dto);
		return ResponseEntity.ok(ok ? "Password updated.Account is now ACTIVE." : "UPDATE failed");

	}

}
