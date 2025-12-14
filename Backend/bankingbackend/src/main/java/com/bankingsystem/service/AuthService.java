package com.bankingsystem.service;

import com.bankingsystem.dao.UserDao;
import com.bankingsystem.dto.LoginRequest;
import com.bankingsystem.dto.LoginResponse;
import com.bankingsystem.entity.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

private final UserDao userDao;

public AuthService(UserDao userDao) {
this.userDao = userDao;
}

public LoginResponse login(LoginRequest request) {

User user = userDao.findByUsername(request.getUsername())
.orElseThrow(() -> new RuntimeException("Invalid username or password"));

if (!user.getPassword().equals(request.getPassword())) {
throw new RuntimeException("Invalid username or password");
}

return new LoginResponse(
"Login Successful",
user.getRole(),
user.getUserId(),
user.getFullName()
);
}
}
