package com.bankingsystem.dao;


import java.util.List;
import java.util.Optional;

import com.bankingsystem.dto.BankManagerDto;
import com.bankingsystem.entity.User;

public interface UserDao {
    Optional<User> findById(Integer id);
    Optional<User> findByUsername(String username);
    List<User> findAll();
    int save(BankManagerDto dto);    // returns generated key or rows affected; see impl
    int update(User user);
    int deleteById(Integer id);
}
