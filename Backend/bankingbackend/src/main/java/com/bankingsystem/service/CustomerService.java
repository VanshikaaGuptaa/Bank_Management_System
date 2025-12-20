package com.bankingsystem.service;

import com.bankingsystem.dto.ChangePasswordDto;
import com.bankingsystem.dto.CreateCustomerDto;
import com.bankingsystem.entity.Customer;
import com.bankingsystem.entity.User;

import java.util.List;
import java.util.Map;

public interface CustomerService {
	Customer createCustomer(CreateCustomerDto dto);

	Customer getCustomerById(Integer id);

	List<Customer> getAllCustomers();

	boolean changePasswordAndActivate(ChangePasswordDto dto);

	List<Map<String, Object>> getCustomerDemographics();

	boolean updateProfile(Integer custId, User user);

	boolean  deleteAccount(String accNo);
}