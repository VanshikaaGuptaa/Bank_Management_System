package com.bankingsystem.controller;

import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.CreateBankEmployeeDto;
import com.bankingsystem.dto.TempCustomerDto;
import com.bankingsystem.dto.UpdateBankEmployeeDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.BankEmployee;
import com.bankingsystem.exception.ResourceNotFoundException;
import com.bankingsystem.service.BankEmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bank-employees")
public class BankEmployeeController {

    private final BankEmployeeService beService;

    public BankEmployeeController(BankEmployeeService beService) {
        this.beService = beService;
    }

    @PostMapping
    public ResponseEntity<BankEmployee> createBE(@RequestBody CreateBankEmployeeDto dto) {
        BankEmployee created = beService.createBE(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankEmployee> getBE(@PathVariable Integer id) {
        BankEmployee be = beService.getBEById(id);
        if (be == null) throw new ResourceNotFoundException("BankEmployee with id " + id + " not found");
        return ResponseEntity.ok(be);
    }

    @GetMapping
    public ResponseEntity<List<BankEmployee>> getAll() {
        return ResponseEntity.ok(beService.getAllBE());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankEmployee> updateBE(@PathVariable Integer id, @RequestBody UpdateBankEmployeeDto dto) {
        BankEmployee updated = beService.updateBE(id, dto);
        if (updated == null) throw new ResourceNotFoundException("BankEmployee with id " + id + " not found");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBE(@PathVariable Integer id) {
        boolean deleted = beService.deleteBE(id);
        if (!deleted) throw new ResourceNotFoundException("BankEmployee with id " + id + " not found");
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/temp-customers/{id}/approve")
    public ResponseEntity<?> approveCustomer(@PathVariable("id") int tempCustomerId) {
        try {
            Integer customerId = beService.approveCustomer(tempCustomerId);
            return ResponseEntity.ok(
                    Map.of(
                            "customerId", customerId,
                            "message", "customer approved"
                    )
            );
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "Database error", "details", ex.getMessage()));
        }
    }
    @PostMapping("/{tempId}/disapprove")
    public ResponseEntity<?>dispproveTempBM(@PathVariable("tempId") int tempCustId){
    	beService.disapproveCustomer(tempCustId);
    	return ResponseEntity.ok().body(Map.of("disapproved",true));
    }
    @PostMapping("/{beId}/customers/{custId}/accounts")
    public ResponseEntity<Account> openAccountForExistingCustomer(
            @PathVariable("beId") int beId,
            @PathVariable("custId") int custId,
            @RequestBody CreateAccountDto dto) {

        dto.setCustId(custId);
        Account account = beService.openAccountForExistingCustomer(beId, dto);
        return ResponseEntity.ok(account);
    
}
    @PutMapping(
            value = "/{id}/profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateProfile(
            @PathVariable("id") Integer beId,
            @RequestParam String username,
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        boolean ok = beService.updateProfile(beId, username, fullName, email, phone,  image);
        return ResponseEntity.ok(Map.of("updated", ok));
    }
    @GetMapping("/{beId}/temp-customers")
    public ResponseEntity<List<TempCustomerDto>> getTempCustomersForBE(
            @PathVariable("beId") int beId) {

        List<TempCustomerDto> list = beService.getTempCustomersForBE(beId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/profile-image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable("id") Integer beId) {
        byte[] image = beService.getProfileImage(beId);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // or detect dynamically
        return ResponseEntity.ok()
                .headers(headers)
                .body(image);
    }
   

}
