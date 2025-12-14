
package com.bankingsystem.service;

import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.CreateBankEmployeeDto;
import com.bankingsystem.dto.TempCustomerDto;
import com.bankingsystem.dto.UpdateBankEmployeeDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.BankEmployee;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface BankEmployeeService {

    BankEmployee createBE(CreateBankEmployeeDto dto);

    BankEmployee getBEById(Integer id);

    List<BankEmployee> getAllBE();

    BankEmployee updateBE(Integer beId, UpdateBankEmployeeDto dto);

    boolean deleteBE(Integer beId);

	boolean disapproveCustomer(int tempcustId);
	public Integer approveCustomer(int tempCustomerId);

	Account openAccountForExistingCustomer(int beId, CreateAccountDto dto);
	  boolean updateProfile(Integer beId,
              String username,
              String fullName,
              String email,
              String phone,
              MultipartFile image);

byte[] getProfileImage(Integer beId);
List<TempCustomerDto> getTempCustomersForBE(int beId);
}