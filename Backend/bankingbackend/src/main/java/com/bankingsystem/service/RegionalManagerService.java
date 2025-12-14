package com.bankingsystem.service;

import com.bankingsystem.dto.CreateBranchDto;
import com.bankingsystem.dto.CreateRegionalManagerDto;
import com.bankingsystem.dto.TempBankManagerDto;
import com.bankingsystem.dto.UpdateRegionalManagerDto;
import com.bankingsystem.entity.Branch;
import com.bankingsystem.entity.RegionalManager;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RegionalManagerService {
	RegionalManager createRM(CreateRegionalManagerDto dto);

	Branch createBranch(CreateBranchDto dto);

	RegionalManager getRMById(Integer id);

	List<RegionalManager> getAllRM();

	RegionalManager updateRM(Integer rmId, UpdateRegionalManagerDto dto);

	boolean deleteRM(Integer rmId);

	Integer approveTempBankManager(int tempBmId, int rmUserId, String comment);

//	List<TempBankManagerDto> getTempBankManagersForCurrentRM();
	boolean approveBM(int tempBmId);

	boolean disapproveBM(int tempBmId);

//	boolean deleteBranch(CreateBranchDto dto);
	boolean deleteBranch(int branchId);

	List<Branch> getAllBranches();

	List<TempBankManagerDto> getTempBankManagersForUser(Integer currentUserId);

	boolean updateProfile(Integer rmId, String username, String fullName, String email, String phone, String address,
			MultipartFile image);

	byte[] getProfileImage(Integer id);

}