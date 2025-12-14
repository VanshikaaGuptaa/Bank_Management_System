package com.bankingsystem.controller;

import com.bankingsystem.dto.CreateBranchDto;
import com.bankingsystem.dto.CreateRegionalManagerDto;
import com.bankingsystem.dto.TempBankManagerDto;
import com.bankingsystem.security.SecurityUtil;
import com.bankingsystem.dto.UpdateRegionalManagerDto;
import com.bankingsystem.entity.Branch;
import com.bankingsystem.entity.RegionalManager;
import com.bankingsystem.exception.ResourceNotFoundException;
import com.bankingsystem.service.RegionalManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/rm")
public class RegionalManagerController {

	private final RegionalManagerService rmService;
	private SecurityUtil securityUtil;

	public RegionalManagerController(RegionalManagerService rmService, SecurityUtil securityUtil) {
		this.rmService = rmService;
		this.securityUtil = securityUtil;
	}

	@PostMapping
	public ResponseEntity<RegionalManager> createRM(@RequestBody CreateRegionalManagerDto dto) {
		RegionalManager created = rmService.createRM(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@PostMapping("/createbranch")
	public ResponseEntity<Branch> createBranch(@RequestBody CreateBranchDto dto) {
		Branch created = rmService.createBranch(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@GetMapping("/{id}")
	public ResponseEntity<RegionalManager> getRM(@PathVariable Integer id) {
		RegionalManager rm = rmService.getRMById(id);
		if (rm == null)
			throw new ResourceNotFoundException("RegionalManager with id " + id + " not found");
		return ResponseEntity.ok(rm);
	}

	@GetMapping
	public ResponseEntity<List<RegionalManager>> getAll() {
		return ResponseEntity.ok(rmService.getAllRM());
	}

	@GetMapping("/branches")
	public ResponseEntity<List<Branch>> getAllBranches() {
		return ResponseEntity.ok(rmService.getAllBranches());
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateRM(@PathVariable Integer id, @RequestBody UpdateRegionalManagerDto dto) {
		RegionalManager updated = rmService.updateRM(id, dto);
		if (updated == null)
			throw new ResourceNotFoundException("RegionalManager with id " + id + " not found");
		return ResponseEntity.ok(updated);
	}

	@PutMapping(value = "/{id}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateProfile(@PathVariable("id") Integer rmId,
			@RequestParam(required = false) String username, @RequestParam(required = false) String fullName,
			@RequestParam(required = false) String email, @RequestParam(required = false) String phone,
			@RequestParam(required = false) String address,
			@RequestPart(value = "image", required = false) MultipartFile image) {
		boolean ok = rmService.updateProfile(rmId, username, fullName, email, phone, address, image);
		return ResponseEntity.ok(Map.of("updated", ok));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteRM(@PathVariable Integer id) {
		boolean ok = rmService.deleteRM(id);
		if (!ok)
			throw new ResourceNotFoundException("RegionalManager with id " + id + " not found");
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/deletebranch/{id}")
	public ResponseEntity<Void> deleteBranch(@PathVariable Integer id) {
		boolean ok = rmService.deleteBranch(id);
		if (!ok)
			throw new ResourceNotFoundException("Branch with id " + id + " not found");
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{tempId}/approve")
	public ResponseEntity<Map<String, Object>> approveTempBankManager(@PathVariable("tempId") int tempId,
			@RequestParam(value = "comment", required = false) String comment, Principal principal // or
																									// @AuthenticationPrincipal
																									// — adapt to your
																									// security setup
	) {

		Integer rmUserId = securityUtil.getCurrentUserId();

		Integer bmId = rmService.approveTempBankManager(tempId, rmUserId, comment);
		Map<String, Object> body = Map.of("approved", true, "bmId", bmId);
		return ResponseEntity.ok(body);
	}

	@GetMapping("/temp-bank-managers")
	public ResponseEntity<List<TempBankManagerDto>> getTempBankManagers(@RequestParam("rmUserId") Integer rmUserId) {

		List<TempBankManagerDto> list = rmService.getTempBankManagersForUser(rmUserId);
		return ResponseEntity.ok(list);
	}

	@PostMapping("/{tempId}/disapprove")
	public ResponseEntity<?> dispproveTempBM(@PathVariable("tempId") int tempBmId) {
		rmService.disapproveBM(tempBmId);
		return ResponseEntity.ok().body(Map.of("disapproved", true));
	}

	@GetMapping("/{id}/profile-image")
	public ResponseEntity<byte[]> getProfileImage(@PathVariable Integer id) {
		byte[] image = rmService.getProfileImage(id);
		if (image == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().header("Content-Type", "image/jpeg").body(image);
	}

}