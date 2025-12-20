package com.bankingsystem.service.impl;

import com.bankingsystem.dto.ChangePasswordDto;
import com.bankingsystem.dto.CreateCustomerDto;
import com.bankingsystem.entity.Customer;
import com.bankingsystem.entity.User;
import com.bankingsystem.security.SecurityUtil;
import com.bankingsystem.service.CustomerService;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerServiceImpl implements CustomerService {

	private final JdbcTemplate jdbcTemplate;
	private final PasswordEncoder passwordEncoder;
	public CustomerServiceImpl(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
		this.jdbcTemplate = jdbcTemplate;
		this.passwordEncoder = passwordEncoder;
	}
	@Override
    public List<Map<String, Object>> getCustomerDemographics() {
        String sql = """
            SELECT
                CASE
                    WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN 36 AND 50 THEN '36-50'
                    ELSE '51+'
                END AS age_group,
                b.address AS location,
                a.acc_type AS account_type,
                COUNT(*) AS count
            FROM customer c
            JOIN user u ON c.user_id = u.user_id
            JOIN branch b ON c.branch_id = b.branch_id
            JOIN account a ON c.cust_id = a.cust_id
            GROUP BY age_group, location, account_type
            ORDER BY age_group, location, account_type
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("ageGroup", rs.getString("age_group"));
            map.put("location", rs.getString("location"));
            map.put("accountType", rs.getString("account_type"));
            map.put("count", rs.getInt("count"));
            return map;
        });
    }
    
    @Override
    public Customer createCustomer(CreateCustomerDto dto) {

    	String userSql =
                "INSERT INTO temp_customer (branch_id,username, password, email, phone, full_name, role, status, created_at) " +
                "VALUES (?,?, ?, ?, ?, ?, 'Customer', 'Pending', NOW())";

        jdbcTemplate.update(userSql,
        		dto.getBranchId(),
                dto.getUsername(),
                dto.getPassword(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getFullName()
        );

        Integer userId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

        Customer c = new Customer();
//        c.setCustId(custId);
//        c.setUserId(userId);
//        c.setBranchId(dto.getBranchId());
//        c.setCreatedByBe(dto.getCreatedByBe());

        return c;
    }

    @Override
    public Customer getCustomerById(Integer id) {
        String sql = "SELECT * FROM customer WHERE cust_id = ?";
        Customer c = jdbcTemplate.queryForObject(sql,(rs,rowNum) -> mapCustomer(rs),id);
        
        // return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> mapCustomer(rs), id);
        if(c!=null) {
        	String userSql = "SELECT * FROM user WHERE user_id = ?";
        	User u = jdbcTemplate.queryForObject(userSql,(rs,rowNum) -> mapUser(rs),c.getUserId());
        	c.setUser(u);
        }
        return c;
    }

    @Override
    public List<Customer> getAllCustomers() {
        String sql = "SELECT * FROM customer";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapCustomer(rs));
    }
    @Override
    public boolean updateProfile(Integer custId, User updated) {

        Customer c = getCustomerById(custId);   // already fetches user
        User u = c.getUser();

        String sql = "UPDATE user SET full_name = ?, email = ?, phone = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, updated.getFullName(), updated.getEmail(), updated.getPhone(), u.getUserId());

        return true;
    }
    @Override
public boolean deleteAccount(String accNo) {

    int subAccRows =
        jdbcTemplate.update(
            "DELETE FROM subsequent_account WHERE account_no = ?",
            accNo
        );

    int txnRows =
        jdbcTemplate.update(
            "DELETE FROM `transaction` WHERE acc_no = ?",
            accNo
        );

    int accRows =
        jdbcTemplate.update(
            "DELETE FROM account WHERE acc_no = ?",
            accNo
        );

    // If main account row not deleted → nothing happened
    return accRows > 0;
}

    @Override
    public boolean changePasswordAndActivate(ChangePasswordDto dto) {

        String selectSql = "SELECT user_id, password, status FROM user WHERE username = ?";

        try {
            return jdbcTemplate.queryForObject(selectSql, (rs, rowNum) -> {

                int userId = rs.getInt("user_id");
                String dbPassword = rs.getString("password");
                String status = rs.getString("status");

                // 1) Only TEMP users can change password first time
                if (!"Inactive".equalsIgnoreCase(status)) {
                    throw new RuntimeException("Password already changed or account is not in TEMP state");
                }

                // 2) Compare OLD password using BCrypt (NOT equals)
                if (!passwordEncoder.matches(dto.getOldPassword(), dbPassword)) {
                    throw new RuntimeException("Old password is incorrect");
                }

                // 3) Encode NEW PASSWORD before saving
                String encodedNewPassword = passwordEncoder.encode(dto.getNewPassword());

                String updateSql =
                        "UPDATE user SET password = ?, status = 'ACTIVE' WHERE user_id = ?";

                jdbcTemplate.update(updateSql, encodedNewPassword, userId);

                return true;
            }, dto.getUsername());

        } catch (EmptyResultDataAccessException ex) {
            throw new RuntimeException("User not found");
        }
    }

    private Customer mapCustomer(ResultSet rs) throws SQLException {
        Customer c = new Customer();
        c.setCustId(rs.getInt("cust_id"));
        c.setCreatedByBe(rs.getInt("created_by_be"));
        c.setUserId(rs.getInt("user_id"));
        c.setBranchId(rs.getInt("branch_id"));
        return c;
    }
    private User mapUser(ResultSet rs) throws SQLException {
        User u = new User();
        u.setUserId(rs.getInt("user_id"));
        u.setFullName(rs.getString("full_name"));
        u.setEmail(rs.getString("email"));
        u.setPhone(rs.getString("phone"));
        return u;
}}
