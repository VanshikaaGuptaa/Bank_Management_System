package com.bankingsystem.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankingsystem.service.BranchService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/branches")
public class BranchController {

	private final BranchService branchService;

	public BranchController(BranchService branchService) {
		this.branchService = branchService;
	}

	@GetMapping("/report/performance")
	public ResponseEntity<List<Map<String, Object>>> getBranchPerformance() {
		return ResponseEntity.ok(branchService.getBranchPerformanceReport());
	}
}