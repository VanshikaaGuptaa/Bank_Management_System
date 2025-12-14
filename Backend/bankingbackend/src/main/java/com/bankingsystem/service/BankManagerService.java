package com.bankingsystem.service;

import com.bankingsystem.dto.CreateBankManagerDto;
import com.bankingsystem.dto.TempBankEmployeeDto;
import com.bankingsystem.dto.TempLoanDto;
import com.bankingsystem.dto.UpdateBankManagerDto;
import com.bankingsystem.entity.BankManager;
import com.bankingsystem.entity.Loan;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface BankManagerService {
	List<BankManager> getAllBM();

	BankManager getBMById(int bmId);

	Integer createBM(CreateBankManagerDto dto);

	boolean updateBM(int bmId, UpdateBankManagerDto dto);

	boolean deleteBM(int bmId);

	boolean approveBM(int bmId, String approvedByRole, String comment); // approve by RM (or other role)
//		boolean approveBE(int beId, String comment);

	Integer approveBE(int tempBeId);

//		List<TempBankEmployeeDto> getTempBankEmployeesForCurrentBM();
//		List<TempBankEmployeeDto> getTempBankEmployeesByBranch();
//		List<TempBankEmployeeDto> getTempBankEmployeesByBranch();
//		List<TempBankEmployeeDto> getTempBankEmployeesByBranch(Integer branchId);
//		List<TempBankEmployeeDto> getTempBankEmployeesForCurrentBM();
	boolean disapproveBE(int tempBeId);

	boolean disapproveLoan(int tempLoanId);

	Integer approveLoan(int tempLoanId, int bmId);

	boolean updateProfile(Integer id, String username, String fullName, String email, String phone, String address,
			MultipartFile image);

	byte[] getProfileImageBytes(Integer id);

	List<TempBankEmployeeDto> getTempBankEmployeesForCurrentBM(Integer bmId);

	List<TempLoanDto> getPendingLoans();
}