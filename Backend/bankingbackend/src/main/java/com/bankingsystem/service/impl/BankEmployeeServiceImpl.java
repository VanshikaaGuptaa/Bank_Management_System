
package com.bankingsystem.service.impl;

import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.CreateBankEmployeeDto;
import com.bankingsystem.dto.TempCustomerDto;
import com.bankingsystem.dto.UpdateBankEmployeeDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.BankEmployee;
import com.bankingsystem.service.AccountService;
import com.bankingsystem.service.BankEmployeeService;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.jdbc.core.RowMapper;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class BankEmployeeServiceImpl implements BankEmployeeService {

	private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final AccountService accountService;

    public BankEmployeeServiceImpl(JdbcTemplate jdbcTemplate,PasswordEncoder passwordEncoder,AccountService accountService) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder=passwordEncoder;
        this.accountService = accountService;
    }

    // RowMapper for joined result (bank_employee + user)
    private final RowMapper<BankEmployee> joinedRowMapper = (rs, rowNum) -> {
        BankEmployee be = new BankEmployee();
        be.setBeId(rs.getInt("be_id"));
        be.setApprovedByBm(rs.getBoolean("approved_by_bm"));

        int userId = rs.getInt("user_id");
        if (rs.wasNull()) be.setUserId(null); else be.setUserId(userId);

        int branchId = rs.getInt("branch_id");
        if (rs.wasNull()) be.setBranchId(null); else be.setBranchId(branchId);

        // user fields (may be null if join not returning)
        be.setUsername(rs.getString("username"));
        be.setEmail(rs.getString("email"));
        be.setPhone(rs.getString("phone"));
        be.setFullName(rs.getString("full_name"));
        be.setRole(rs.getString("role"));
        be.setStatus(rs.getString("status"));

        return be;
    };

    @Override
    @Transactional 
    public BankEmployee createBE(CreateBankEmployeeDto dto) {
        // 0. quick branch existence check (avoids FK error later)
        if (dto.getBranchId() != null) {
            Integer cnt = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM branch WHERE branch_id = ?",
                new Object[]{dto.getBranchId()},
                Integer.class
            );
            if (cnt == null || cnt == 0) {
                throw new IllegalArgumentException("branchId " + dto.getBranchId() + " does not exist");
            }
        }

        try {
            // 1. insert user
            String userSql = "INSERT INTO temp_bank_employees (username, password, email, phone, full_name, role, status, created_at, uploaded_docs, profile_image,branch_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?,?)";

            KeyHolder userKeyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(con -> {
                PreparedStatement ps = con.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, dto.getUsername());
                ps.setString(2, dto.getPassword());
                ps.setString(3, dto.getEmail());
                ps.setString(4, dto.getPhone());
                ps.setString(5, dto.getFullName());
                ps.setString(6, dto.getRole());
                ps.setString(7, dto.getStatus());
                ps.setString(8, "[]"); // or appropriate default
                ps.setBytes(9, null);
                ps.setInt(10, dto.getBranchId());
                return ps;
            }, userKeyHolder);

            Integer userId = (userKeyHolder.getKey() != null) ? userKeyHolder.getKey().intValue() : null;
            if (userId == null) throw new DataAccessException("Failed to get generated user_id") {};


            KeyHolder beKeyHolder = new GeneratedKeyHolder();
//


            Integer beId = (beKeyHolder.getKey() != null) ? beKeyHolder.getKey().intValue() : null;
//
//            // 3. build response object
            BankEmployee be = new BankEmployee();
            be.setBeId(beId);
            be.setApprovedByBm(dto.getApprovedByBm());
            be.setUserId(userId);
            be.setBranchId(dto.getBranchId());
            be.setUsername(dto.getUsername());
            be.setEmail(dto.getEmail());
            be.setPhone(dto.getPhone());
            be.setFullName(dto.getFullName());
            be.setRole(dto.getRole());
            be.setStatus(dto.getStatus());
//
            return be;

        } catch (DataAccessException dae) {
            // Log and rethrow so transaction will rollback
            System.err.println("SQL error creating BankEmployee: " + dae.getMessage());
            throw dae;
        } catch (IllegalArgumentException iae) {
            System.err.println("Validation error creating BankEmployee: " + iae.getMessage());
            throw iae;
        }
    }

    @Override
    public BankEmployee getBEById(Integer id) {
    	
        String sql = "SELECT be.be_id, be.approved_by_bm, be.user_id, be.branch_id, " +
                     "u.username, u.email, u.phone, u.full_name, u.role, u.status " +
                     "FROM bank_employee be " +
                     "JOIN user u ON be.user_id = u.user_id " +
                     "WHERE be.be_id = ?";

        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{id}, joinedRowMapper);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public List<BankEmployee> getAllBE() {
        String sql = "SELECT be.be_id, be.approved_by_bm, be.user_id, be.branch_id, " +
                     "u.username, u.email, u.phone, u.full_name, u.role, u.status " +
                     "FROM bank_employee be " +
                     "JOIN user u ON be.user_id = u.user_id";
        return jdbcTemplate.query(sql, joinedRowMapper);
    }

    @Override
    @Transactional
    public BankEmployee updateBE(Integer beId, UpdateBankEmployeeDto dto) {
        // 1) get user_id for this bank_employee
        String selectSql = "SELECT user_id FROM bank_employee WHERE be_id = ?";
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(selectSql, new Object[]{beId}, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            return null; // bank_employee not found
        }

        // 2) update bank_employee fields (approved_by_bm and branch_id) - unchanged
        String updateBeSql = "UPDATE bank_employee SET approved_by_bm = COALESCE(?, approved_by_bm), branch_id = COALESCE(?, branch_id) WHERE be_id = ?";
        jdbcTemplate.update(updateBeSql, dto.getApprovedByBm(), dto.getBranchId(), beId);

        // 3) update user fields individually if provided (safer and easier to debug)
        try {
        	
            if (dto.getEmail() != null) {
                jdbcTemplate.update("UPDATE user SET email = ? WHERE user_id = ?", dto.getEmail(), userId);
                System.out.println("Updated user.email for userId=" + userId);
            }
            if (dto.getPhone() != null) {
                jdbcTemplate.update("UPDATE user SET phone = ? WHERE user_id = ?", dto.getPhone(), userId);
                System.out.println("Updated user.phone for userId=" + userId);
            }
            if (dto.getFullName() != null) {
                // DB column is full_name
                jdbcTemplate.update("UPDATE user SET full_name = ? WHERE user_id = ?", dto.getFullName(), userId);
                System.out.println("Updated user.full_name for userId=" + userId);
            }
            if (dto.getStatus() != null) {
                jdbcTemplate.update("UPDATE user SET status = ? WHERE user_id = ?", dto.getStatus(), userId);
                System.out.println("Updated user.status for userId=" + userId);
            }
            if (dto.getRole() != null) {
                jdbcTemplate.update("UPDATE user SET role = ? WHERE user_id = ?", dto.getRole(), userId);
                System.out.println("Updated user.role for userId=" + userId);
            }
        } catch (DataAccessException dae) {
            // log and rethrow so transaction will roll back
            System.err.println("Error updating user for userId=" + userId + " : " + dae.getMessage());
            throw dae;
        }

        // 4) Return joined object
        return getBEById(beId);
    }
    @Override
    @Transactional
    public boolean deleteBE(Integer beId) {
        // 1) fetch user_id for this bank_employee
        String getUserSql = "SELECT user_id FROM bank_employee WHERE be_id = ?";
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(getUserSql, new Object[]{beId}, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            return false; // not found
        }

        // 2) delete bank_employee row
        String deleteBeSql = "DELETE FROM bank_employee WHERE be_id = ?";
        int deleted = jdbcTemplate.update(deleteBeSql, beId);
        if (deleted == 0) {
            return false;
        }

        // 3) check if this user_id is referenced elsewhere (bank_employee, bank_manager, regional_manager)
        String refCountSql =
            "SELECT (SELECT COUNT(1) FROM bank_employee WHERE user_id = ?) + " +
            "(SELECT COUNT(1) FROM bank_manager WHERE user_id = ?) + " +
            "(SELECT COUNT(1) FROM regional_manager WHERE user_id = ?) AS total_refs";

        Integer totalRefs = jdbcTemplate.queryForObject(refCountSql, new Object[]{userId, userId, userId}, Integer.class);

        // 4) if no other references, delete user row
        if (totalRefs == null) totalRefs = 0;
        if (totalRefs == 0) {
            jdbcTemplate.update("DELETE FROM user WHERE user_id = ?", userId);
        }

        return true;
    }

    public Integer approveCustomer(int tempCustomerId) {

        // 1) Fetch temp_customer row
        final String fetchSql =
                "SELECT temp_customer_id, username, password, email, phone, full_name, " +
                " role, status, created_at, uploaded_docs, profile_image, branch_id " +
                "FROM temp_customer WHERE temp_customer_id = ?";

        Map<String, Object> temp;
        try {
            temp = jdbcTemplate.queryForMap(fetchSql, tempCustomerId);
        } catch (Exception ex) {
            throw new RuntimeException("temp_customer not found: " + tempCustomerId);
        }

        // 2) Read values
        final String username = (String) temp.get("username");
        final String rawPassword= (String) temp.get("password");
        final String email = (String) temp.get("email");
        final String phone = (String) temp.get("phone");
        final String fullName = (String) temp.get("full_name");
        final String role = (String) temp.get("role"); // should be "Customer"
        final String status = "Inactive"; // "Pending" / "Active"
        final java.sql.Timestamp createdAt =
                (java.sql.Timestamp) temp.get("created_at");
        final Object uploadedDocs = temp.get("uploaded_docs"); // JSON (String) or null
        final Object profileImage = temp.get("profile_image"); // byte[] / Blob / null
        final Integer branchId =
                (temp.get("branch_id") == null) ? null : ((Number) temp.get("branch_id")).intValue();

        if (username == null || rawPassword == null) {
            throw new IllegalArgumentException("username and password are required in temp_customer row: " + tempCustomerId);
        }
        if (branchId == null) {
            throw new IllegalArgumentException("branch_id is required in temp_customer row: " + tempCustomerId);
        }

        // 3) Check duplicate username
        final String dupSql = "SELECT COUNT(1) FROM user WHERE username = ?";
        Integer existing = jdbcTemplate.queryForObject(dupSql, Integer.class, username);
        if (existing != null && existing > 0) {
            throw new RuntimeException("username already exists: " + username);
        }

        // 4) Insert into user and get generated user_id
        final String insertUserSql =
                "INSERT INTO user (username, password, email, phone, full_name, role, status, created_at, uploaded_docs, profile_image) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder userKey = new GeneratedKeyHolder();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(insertUserSql, Statement.RETURN_GENERATED_KEYS);
            int i = 1;
            ps.setString(i++, username);
            ps.setString(i++, encodedPassword);
            ps.setString(i++, email);
            ps.setString(i++, phone);
            ps.setString(i++, fullName);
            ps.setString(i++, (role != null ? role : "Customer")); // default to Customer
            ps.setString(i++, (status != null ? status : "Active"));
            if (createdAt != null) {
                ps.setTimestamp(i++, createdAt);
            } else {
                ps.setTimestamp(i++, new java.sql.Timestamp(System.currentTimeMillis()));
            }

            // uploaded_docs
            if (uploadedDocs == null) {
                ps.setNull(i++, Types.VARCHAR);
            } else {
                ps.setString(i++, uploadedDocs.toString());
            }

            // profile_image
            if (profileImage == null) {
                ps.setNull(i++, Types.BLOB);
            } else if (profileImage instanceof byte[]) {
                ps.setBytes(i++, (byte[]) profileImage);
            } else if (profileImage instanceof java.sql.Blob) {
                ps.setBlob(i++, (java.sql.Blob) profileImage);
            } else {
                ps.setNull(i++, Types.BLOB);
            }

            return ps;
        }, userKey);

        Number userKeyNum = userKey.getKey();
        if (userKeyNum == null) {
            throw new RuntimeException("failed to create user record for temp_customer: " + tempCustomerId);
        }
        final Integer userId = userKeyNum.intValue();

        // 5) Insert into customer (link to user + branch)
        final String insertCustomerSql =
                "INSERT INTO customer (user_id, branch_id) VALUES (?, ?)";

        KeyHolder custKey = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(insertCustomerSql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, userId);
            ps.setInt(2, branchId);
            return ps;
        }, custKey);

        Number custKeyNum = custKey.getKey();
        if (custKeyNum == null) {
            throw new RuntimeException("failed to create customer record for user: " + userId);
        }
        final Integer customerId = custKeyNum.intValue();

        // 6) Delete temp_customer row
        int deleted = jdbcTemplate.update("DELETE FROM temp_customer WHERE temp_customer_id = ?", tempCustomerId);
        if (deleted != 1) {
            throw new RuntimeException("failed to delete temp_customer row after approval: " + tempCustomerId);
        }

        // 7) return created customer id
        return customerId;
    }


    @Transactional
    @Override
    public boolean disapproveCustomer(int tempcustId) {
        final String deleteTempSql = "DELETE FROM temp_customer WHERE Temp_Customer_ID = ?";
        int deleted = jdbcTemplate.update(deleteTempSql, tempcustId);
        if (deleted != 1) {
            // this shouldn't happen, rollback the whole transaction by throwing
            throw new RuntimeException("Failed to delete temp customer row: temp_cust_id=" + tempcustId);
        }

        return true; // success
    }
    
//    @Override
//    public Account openAccountForExistingCustomer(int beId, CreateAccountDto dto) {
//        // beId is available in case you later want to log who opened the account.
//        // For now we just delegate to AccountService.
//        if (dto.getCustId() == null) {
//            throw new IllegalArgumentException("custId is required");
//        }
//        if (dto.getAccType() == null || dto.getAccType().trim().isEmpty()) {
//            throw new IllegalArgumentException("accType is required");
//        }
//
//        // This will also enforce "only if customer exists / no existing account"
//        // using the logic you already have in AccountServiceImpl.createAccount(...)
//        return accountService.createAccount(dto);
//    }
    @Override
    public Account openAccountForExistingCustomer(int beId, CreateAccountDto dto) {
        // beId kept if you want to log who opened it later
        if (dto.getCustId() == null) {
            throw new IllegalArgumentException("custId is required");
        }
        if (dto.getAccType() == null || dto.getAccType().trim().isEmpty()) {
            throw new IllegalArgumentException("accType is required");
        }

        // IMPORTANT: this bypasses the "customer must already have an account" rule
        // and allows the FIRST account to be opened by a bank employee.
        return accountService.createAccountByEmployee(dto);
    }
    @Override
    public boolean updateProfile(Integer beId,
                                 String username,
                                 String fullName,
                                 String email,
                                 String phone,
                                 MultipartFile image) {

        // 1) resolve user_id for this bank employee
        final String findUserSql =
                "SELECT user_id FROM bank_employee WHERE be_id = ?";

        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(findUserSql,
                    new Object[]{ beId }, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            // no such BE
            return false;
        }

        try {
            // 2) update user table
            String updateUserSql =
                    "UPDATE user SET username = ?, full_name = ?, email = ?, phone = ? " +
                    "WHERE user_id = ?";
            jdbcTemplate.update(updateUserSql,
                    username, fullName, email, phone, userId);

           

            // 4) optional profile image -> user.profile_image
            if (image != null && !image.isEmpty()) {
                String updateImgSql =
                        "UPDATE user SET profile_image = ? WHERE user_id = ?";
                jdbcTemplate.update(updateImgSql, image.getBytes(), userId);
            }

            return true;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image bytes", e);
        } catch (DataAccessException ex) {
            throw new RuntimeException("Failed to update bank employee profile", ex);
        }
    }

    @Override
    public byte[] getProfileImage(Integer beId) {
        // again resolve user_id first
        final String findUserSql =
                "SELECT user_id FROM bank_employee WHERE be_id = ?";

        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(findUserSql,
                    new Object[]{ beId }, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }

        final String sql =
                "SELECT profile_image FROM user WHERE user_id = ?";

        try {
            return jdbcTemplate.queryForObject(sql,
                    new Object[]{ userId },
                    (rs, rowNum) -> rs.getBytes("profile_image"));
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }
    @Override
    public List<TempCustomerDto> getTempCustomersForBE(int beId) {

        // 1) find branch_id of this bank employee
        final String branchSql = "SELECT branch_id FROM bank_employee WHERE be_id = ?";

        Integer branchId;
        try {
            branchId = jdbcTemplate.queryForObject(branchSql, Integer.class, beId);
        } catch (EmptyResultDataAccessException ex) {
            // BE not found
            return Collections.emptyList();
        }

        if (branchId == null) {
            return Collections.emptyList();
        }

        // 2) fetch temp customers of that branch (pending)
        final String sql =
            "SELECT Temp_Customer_ID, username, email, phone, full_name, " +
            "status, created_at, uploaded_docs, profile_image, branch_id " +
            "FROM temp_customer " +
            "WHERE branch_id = ? " +
            "ORDER BY created_at DESC";

        return jdbcTemplate.query(sql, new Object[]{ branchId }, (rs, rowNum) -> mapTempCustomer(rs));
    }

    // Mapper helper
    private TempCustomerDto mapTempCustomer(ResultSet rs) throws SQLException {
        TempCustomerDto dto = new TempCustomerDto();

        // column names: adjust to match your DB
        dto.setTempCustId(rs.getInt("Temp_Customer_ID"));
        dto.setUsername(rs.getString("username"));
        dto.setEmail(rs.getString("email"));
        dto.setPhone(rs.getString("phone"));
        dto.setFullName(rs.getString("full_name"));
        dto.setStatus(rs.getString("status"));
        dto.setBranchId((Integer) rs.getObject("branch_id"));  // handles NULL
        dto.setCreatedAt(rs.getTimestamp("created_at"));

        // optional
        try {
            dto.setUploadedDocs(rs.getString("uploaded_docs"));
        } catch (SQLException ignored) {}

        try {
            dto.setProfileImage(rs.getBytes("profile_image"));
        } catch (SQLException ignored) {}

        return dto;
    }
}




