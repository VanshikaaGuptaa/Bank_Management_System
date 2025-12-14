package com.bankingsystem.service.impl;

import com.bankingsystem.dto.CreateBankManagerDto;
import com.bankingsystem.dto.TempBankEmployeeDto;
import com.bankingsystem.dto.TempLoanDto;
import com.bankingsystem.dto.UpdateBankManagerDto;
import com.bankingsystem.entity.BankManager;
import com.bankingsystem.entity.Loan;
import com.bankingsystem.entity.User;
import com.bankingsystem.exception.DuplicateResourceException;
import com.bankingsystem.exception.ResourceNotFoundException;
import com.bankingsystem.security.SecurityUtil;
import com.bankingsystem.service.BankManagerService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
import java.sql.*;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class BankManagerServiceImpl implements BankManagerService {

	private final JdbcTemplate jdbcTemplate;
	private final PasswordEncoder passwordEncoder;
	 private SecurityUtil securityUtil;
	public BankManagerServiceImpl(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder,SecurityUtil securityUtil) {
		this.jdbcTemplate = jdbcTemplate;
		this.passwordEncoder = passwordEncoder;
		this.securityUtil=securityUtil;
	}

	// RowMapper builds combined BankManager + user fields
	private final RowMapper<BankManager> joinedRowMapper = (rs, rowNum) -> {
		BankManager bm = new BankManager();
		bm.setBmId(rs.getInt("bm_id"));
		bm.setApprovedByRm(rs.getBoolean("approved_by_rm"));
		int userId = rs.getInt("user_id");
		if (rs.wasNull())
			bm.setUserId(null);
		else
			bm.setUserId(userId);
		int branchId = rs.getInt("branch_id");
		if (rs.wasNull())
			bm.setBranchId(null);
		else
			bm.setBranchId(branchId);

		bm.setUsername(rs.getString("username"));
		bm.setEmail(rs.getString("email"));
		bm.setPhone(rs.getString("phone"));
		bm.setFullName(rs.getString("full_name"));
		bm.setRole(rs.getString("role"));
		bm.setStatus(rs.getString("status"));
		return bm;
	};
	private TempLoanDto mapTempLoan(ResultSet rs) throws SQLException {
	    TempLoanDto dto = new TempLoanDto();

	    dto.setTempLoanId(rs.getInt("temp_loan_id"));
	    dto.setCustomerId(rs.getInt("customer_id"));
	    dto.setAmount(rs.getDouble("amount"));
	    dto.setInterestRate(rs.getDouble("interest_rate"));
	    dto.setTenureMonths(rs.getInt("tenure_months"));
	    dto.setLoanType(rs.getString("loan_type"));

	    // Only if your table has emi_frequency
	    try {
	        dto.setEmiFrequency(rs.getString("emi_frequency"));
	    } catch (Exception ignored) {}

	    dto.setStatus(rs.getString("status"));

	    Timestamp ts = rs.getTimestamp("created_at");
	    dto.setCreatedAt(ts != null ? ts : null);

	    return dto;
	}
	@Override
	public List<BankManager> getAllBM() {
		final String sql = "SELECT bm.bm_id, bm.approved_by_rm, bm.user_id, bm.branch_id, "
				+ "u.username, u.email, u.phone, u.full_name, u.role, u.status "
				+ "FROM bank_manager bm JOIN user u ON bm.user_id = u.user_id";
		try {
			return jdbcTemplate.query(sql, joinedRowMapper);
		} catch (EmptyResultDataAccessException ex) {
			return Collections.emptyList();
		}
	}

	@Override
	public BankManager getBMById(int bmId) {
		final String sql = "SELECT bm.bm_id, bm.approved_by_rm, bm.user_id, bm.branch_id, "
				+ "u.username, u.email, u.phone, u.full_name, u.role, u.status "
				+ "FROM bank_manager bm JOIN user u ON bm.user_id = u.user_id WHERE bm.bm_id = ?";
		try {
			return jdbcTemplate.queryForObject(sql, joinedRowMapper, bmId);
		} catch (EmptyResultDataAccessException ex) {
			throw new ResourceNotFoundException("Bank manager not found with id: " + bmId);
		}
	}

	@Transactional
	@Override
	public Integer createBM(CreateBankManagerDto dto) {
		// basic validation
	    if (dto.getUsername() == null || dto.getPassword() == null) {
	        throw new IllegalArgumentException("username and password required");
	    }

	    // 1) check duplicate username in temp_user or user table (example)
	    Integer cnt = jdbcTemplate.queryForObject(
	        "SELECT COUNT(1) FROM user WHERE username = ?",
	        new Object[]{dto.getUsername()},
	        Integer.class
	    );
	    if (cnt != null && cnt > 0) {
	        throw new DuplicateResourceException("username already exists: " + dto.getUsername());
	    }

	    // 2) check branch exists
	    Integer branchId = dto.getBranchId();
	    if (branchId == null) {
	        throw new IllegalArgumentException("branchId required");
	    }
	    List<Integer> branchRows = jdbcTemplate.query(
	        "SELECT branch_id FROM branch WHERE branch_id = ?",
	        new Object[]{branchId},
	        (rs, rowNum) -> rs.getInt("branch_id")
	    );
	    if (branchRows.isEmpty()) {
	        throw new ResourceNotFoundException("branch not found for id: " + branchId);
	    }

	    // 3) insert into user and get generated key
	    KeyHolder userKeyHolder = new GeneratedKeyHolder();
	    final String insertUserSql = "INSERT INTO temp_bank_managers (username, password, email, phone, full_name, role, status,branch_id, created_at) VALUES (?,?,?,?,?,?,?,?,NOW())";
	    jdbcTemplate.update(con -> {
	        PreparedStatement ps = con.prepareStatement(insertUserSql, Statement.RETURN_GENERATED_KEYS);
	        ps.setString(1, dto.getUsername());
	        ps.setString(2, passwordEncoder.encode(dto.getPassword())); // make sure passwordEncoder exists
	        ps.setString(3, dto.getEmail());
	        ps.setString(4, dto.getPhone());
	        ps.setString(5, dto.getFullName());
	        ps.setString(6, dto.getRole());
	        ps.setString(7, dto.getStatus());
	        ps.setInt(8, dto.getBranchId());
	        return ps;
	    }, userKeyHolder);

	    Number userIdNum = userKeyHolder.getKey();
	    if (userIdNum == null) {
	        throw new RuntimeException("Failed to create user - no generated id returned");
	    }
	    Integer userId = userIdNum.intValue();

	    // 4) insert into bank_manager and get generated key (use key holder so we don't need to select)
	    KeyHolder bmKeyHolder = new GeneratedKeyHolder();
//	    final String insertBmSql = "INSERT INTO bank_manager (approved_by_rm, user_id, branch_id) VALUES (?, ?, ?)";
//	    jdbcTemplate.update(con -> {
//	        PreparedStatement ps = con.prepareStatement(insertBmSql, Statement.RETURN_GENERATED_KEYS);
//	        // approved_by_rm can be null initially (not approved)
//	        if (dto.getApprovedByRm() == null) ps.setNull(1, Types.INTEGER);
//	        else ps.setInt(1, dto.getApprovedByRm());
//	        ps.setInt(2, userId);
//	        ps.setInt(3, branchId);
//	        return ps;
//	    }, bmKeyHolder);

//	    Integer bmIdNum = bmKeyHolder.getKey();
//	    if (bmIdNum == null) {
//	        // fallback: try SELECT but handle empty result gracefully
//	        List<Integer> bmRows = jdbcTemplate.query(
//	            "SELECT bm_id FROM bank_manager WHERE user_id = ? ORDER BY bm_id DESC LIMIT 1",
//	            new Object[]{userId},
//	            (rs, rn) -> rs.getInt("bm_id")
//	        );
//	        if (bmRows.isEmpty()) {
//	            throw new RuntimeException("Failed to retrieve created bank_manager id for user: " + userId);
//	        }
//	        return bmRows.get(0);
//	    }
	    return userId;
	}
	@Override
    public boolean updateProfile(Integer id, String username, String fullName, String email, String phone, String address, MultipartFile image) {
        try {
            Map<String,Object> row = jdbcTemplate.queryForMap("SELECT user_id FROM bank_manager WHERE bm_id = ?", id);
            Integer userId = (Integer)row.get("user_id");
            // update user fields conditionally
            if (username != null) jdbcTemplate.update("UPDATE user SET username = ? WHERE user_id = ?", username, userId);
            if (fullName != null) jdbcTemplate.update("UPDATE user SET full_name = ? WHERE user_id = ?", fullName, userId);
            if (email != null) jdbcTemplate.update("UPDATE user SET email = ? WHERE user_id = ?", email, userId);
            if (phone != null) jdbcTemplate.update("UPDATE user SET phone = ? WHERE user_id = ?", phone, userId);
//            if (address != null) jdbcTemplate.update("UPDATE bank_manager SET address = ? WHERE user_id = ?", address, id);

            if (image != null && !image.isEmpty()) {
                try {
                    byte[] bytes = image.getBytes();
                    // store bytes in user.profile_image column
                    jdbcTemplate.update("UPDATE user SET profile_image = ? WHERE user_id = ?", bytes, userId);
                } catch (Exception ex) {
                    // log
                }
            }
            return true;
        } catch (EmptyResultDataAccessException ex) {
            return false;
        }
    }

    @Override
    public byte[] getProfileImageBytes(Integer id) {
        try {
            Map<String,Object> row = jdbcTemplate.queryForMap("SELECT u.profile_image FROM bank_manager bm JOIN user u ON u.user_id = bm.user_id WHERE bm.bm_id = ?", id);
            return (byte[]) row.get("profile_image");
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }
	@Override
	@Transactional
	public boolean updateBM(int bmId, UpdateBankManagerDto dto) {
		// ensure exists
		BankManager existing = getBMById(bmId); // throws if not found
		Integer userId = existing.getUserId();
		if (userId == null)
			throw new ResourceNotFoundException("No user associated with bm_id " + bmId);

		// username uniqueness
		if (dto.getUsername() != null && !dto.getUsername().equals(existing.getUsername())) {
			Integer c = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM `user` WHERE username = ? AND user_id <> ?",
					Integer.class, dto.getUsername(), userId);
			if (c != null && c > 0)
				throw new DuplicateResourceException("username already in use");
		}

		// update user row
		final String updateUser = "UPDATE `user` SET username = COALESCE(NULLIF(?,''), username), role = COALESCE(?, role), "
				+  "full_name = COALESCE(NULLIF(?,''), full_name), "
				+ "email = COALESCE(NULLIF(?,''), email), phone = COALESCE(NULLIF(?,''), phone) WHERE user_id = ?";
		jdbcTemplate.update(updateUser, dto.getUsername(), dto.getRole(), dto.getFullName(),
				dto.getEmail(), dto.getPhone(), userId);

		if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
			jdbcTemplate.update("UPDATE `user` SET password = ? WHERE user_id = ?",
					passwordEncoder.encode(dto.getPassword()), userId);
		}

		// update bank_manager
		String bmUpdate = "UPDATE bank_manager SET branch_id = COALESCE(?, branch_id) WHERE bm_id = ?";
		jdbcTemplate.update(bmUpdate, dto.getBranchId(), bmId);

		return true;
	}

	@Override
	@Transactional
	public boolean deleteBM(int bmId) {
		Integer userId;
		try {
			userId = jdbcTemplate.queryForObject("SELECT user_id FROM bank_manager WHERE bm_id = ?", Integer.class,
					bmId);
		} catch (EmptyResultDataAccessException ex) {
			throw new ResourceNotFoundException("Bank manager not found with id: " + bmId);
		}

		jdbcTemplate.update("DELETE FROM bank_manager WHERE bm_id = ?", bmId);
		jdbcTemplate.update("DELETE FROM `user` WHERE user_id = ?", userId);

		return true;
	}

	@Override
	@Transactional
	public boolean approveBM(int bmId, String approvedByRole, String comment) {
		// Only a Regional Manager or RM can call this (controller should be secured)
		BankManager bm = getBMById(bmId); // throws if not found
		if (bm.isApprovedByRm()) {
			// already approved - idempotent
			return true;
		}

		// update bank_manager: set approved_by_rm true and add comment (optional)
		jdbcTemplate.update(
				"UPDATE bank_manager SET approved_by_rm = ?, comment = COALESCE(NULLIF(?,''), comment), status = ? WHERE bm_id = ?",
				true, comment, "APPROVED", bmId);

		// optionally update user status to ACTIVE
		if (bm.getUserId() != null) {
			jdbcTemplate.update("UPDATE `user` SET status = ? WHERE user_id = ?", "ACTIVE", bm.getUserId());
		}

		return true;
	}
	@Override
	@Transactional
	public Integer approveBE(int tempBeId) {
	    // 1) fetch temp row
	    final String selectTemp = "SELECT temp_be_id, username, password, email, phone, full_name, role, status, created_at,branch_id " +
	                              "FROM temp_bank_employees WHERE temp_be_id = ?";

	    Map<String, Object> tempRow;
	    try {
	        tempRow = jdbcTemplate.queryForMap(selectTemp, tempBeId);
	    } catch (EmptyResultDataAccessException ex) {
	        throw new ResourceNotFoundException("temp_bank_employees row not found for id=" + tempBeId);
	    }

	    // validate required fields (username, password)
	    String username = (String) tempRow.get("username");
	    String rawPassword = (String) tempRow.get("password");
	    if (username == null || username.trim().isEmpty() || rawPassword == null || rawPassword.trim().isEmpty()) {
	        throw new IllegalArgumentException("username and password are required in temp_bank_employees row: " + tempBeId);
	    }

	    // 2) create user
	    final String insertUserSql =
	            "INSERT INTO user (username, password, email, phone, full_name, role, status, created_at) " +
	            "VALUES (?, ?, ?, ?, ?, ?, 'Active', ?)";

	    String encodedPassword = passwordEncoder.encode(rawPassword);

	    KeyHolder userKeyHolder = new GeneratedKeyHolder();
	    jdbcTemplate.update(connection -> {
	        PreparedStatement ps = connection.prepareStatement(insertUserSql, Statement.RETURN_GENERATED_KEYS);
	        ps.setString(1, username);
	        ps.setString(2, encodedPassword);
	        ps.setString(3, (String) tempRow.get("email"));
	        ps.setString(4, (String) tempRow.get("phone"));
	        ps.setString(5, (String) tempRow.get("full_name"));
	        ps.setString(6, (String) tempRow.get("role"));
	        ps.setObject(7, tempRow.get("created_at")); // timestamp/datetime or null
	        return ps;
	    }, userKeyHolder);

	    Number generatedUserId = userKeyHolder.getKey();
	    if (generatedUserId == null) {
	        throw new RuntimeException("Failed to create user for temp_be_id=" + tempBeId);
	    }
	    Integer userId = generatedUserId.intValue();

	    // 3) create bank_employee row referencing user_id
	    // Adjust the INSERT columns to match your actual bank_employee table
	    Object rawBranch = tempRow.get("branch_id"); // or "branch"
	    Integer branchId = null;
	    if (rawBranch != null) {
	        if (rawBranch instanceof Number) branchId = ((Number) rawBranch).intValue();
	        else branchId = Integer.valueOf(rawBranch.toString());
	    }

	    // fail fast with clear message (instead of DB fk error)
	    if (branchId == null) {
	        throw new RuntimeException("Approval failed: branch_id is null for temp id=" + tempBeId + " tempRow=" + tempRow);
	    }

	    // optional: check branch exists
	    Integer count = jdbcTemplate.queryForObject(
	       "SELECT COUNT(*) FROM branch WHERE branch_id = ?",
	       Integer.class,
	       branchId
	    );
	    if (count == null || count == 0) {
	        throw new RuntimeException("Approval failed: branch id " + branchId + " not found");
	    }
final Integer branchIdFinal=branchId;
	    // explicit prepared statement — no parameter ordering confusion
	    KeyHolder kh = new GeneratedKeyHolder();
	    jdbcTemplate.update(conn -> {
	        PreparedStatement ps = conn.prepareStatement(
	            "INSERT INTO bank_employee (user_id, branch_id, approved_by_bm) VALUES (?, ?,?)",
	            Statement.RETURN_GENERATED_KEYS);
	        ps.setInt(1, userId);
	        ps.setInt(2, branchIdFinal);
	        ps.setBoolean(3, true);
//	        ps.setTimestamp(4, new Timestamp(System.currentTimeMillis()));
	        return ps;
	    }, kh);
	   

	    // 4) delete temp row
	    final String deleteTempSql = "DELETE FROM temp_bank_employees WHERE temp_be_id = ?";
	    int deleted = jdbcTemplate.update(deleteTempSql, tempBeId);
	    if (deleted != 1) {
	        // This shouldn't happen because we previously selected it; rollback the whole transaction
	        throw new RuntimeException("Failed to delete temp row temp_be_id=" + tempBeId);
	    }

	    // 5) return the created user id (or you can return other info)
	    return userId;
}
	
	@Override
	public List<TempBankEmployeeDto> getTempBankEmployeesForCurrentBM(Integer bmUserId) {
	    if (bmUserId == null) return Collections.emptyList();

	    try {
	    	
	        // Step 1: Get branchId for this bank manager
	        final String sql = "SELECT branch_id FROM bank_manager WHERE user_id = ?";
	        Integer branchId = jdbcTemplate.queryForObject(sql, Integer.class, bmUserId);

	        if (branchId == null) {
	            System.out.println("No branch assigned to BM ID: " + bmUserId);
	            return Collections.emptyList();
	        }

	        // Step 2: Fetch temp bank employees of that branch
	        final String empSql = "SELECT temp_be_id, username, email, phone, full_name, role, status, created_at, uploaded_docs, profile_image, branch_id " +
	                              "FROM temp_bank_employees WHERE branch_id = ? ORDER BY created_at DESC";

	        List<TempBankEmployeeDto> list = jdbcTemplate.query(empSql, new Object[]{branchId}, (rs, rowNum) -> {
	            TempBankEmployeeDto dto = new TempBankEmployeeDto();
	            dto.setTempBeId(rs.getInt("temp_be_id"));
	            dto.setUsername(rs.getString("username"));
	            dto.setEmail(rs.getString("email"));
	            dto.setPhone(rs.getString("phone"));
	            dto.setFullName(rs.getString("full_name"));
	            dto.setRole(rs.getString("role"));
	            dto.setStatus(rs.getString("status"));
	            dto.setCreatedAt(rs.getTimestamp("created_at"));
	            dto.setUploadedDocs(rs.getString("uploaded_docs"));
	            dto.setBranchId(rs.getInt("branch_id"));
	            return dto;
	        });

	        return list;

	    } catch (Exception e) {
	        e.printStackTrace();
	        return Collections.emptyList();
	    }
	}

	private TempBankEmployeeDto mapTempBankEmployee(ResultSet rs) throws SQLException {
	    TempBankEmployeeDto dto = new TempBankEmployeeDto();

	    // int PK
	    dto.setTempBeId(rs.getInt("temp_be_id"));
	    if (rs.wasNull()) {
	        // if you want to mark missing primary key as null (unlikely) you could set null; usually not needed
	    }

	    // basic strings
	    dto.setUsername(rs.getString("username")); // may be null if DB allows
	    dto.setPassword(rs.getString("password")); // probably hashed; include only if needed
	    dto.setEmail(rs.getString("email"));
	    dto.setPhone(rs.getString("phone"));
	    dto.setFullName(rs.getString("full_name"));
	    dto.setRole(rs.getString("role"));
	    dto.setStatus(rs.getString("status"));

	    // branch_id can be NULL in db — use getInt + wasNull check
	    int b = rs.getInt("branch_id");
	    if (!rs.wasNull()) {
	        dto.setBranchId(b); // DTO should accept Integer or int accordingly
	    } else {
	        dto.setBranchId(null);
	    }

	    // created_at: map to Timestamp or LocalDateTime depending on DTO
	    Timestamp ts = rs.getTimestamp("created_at");
	    if (ts != null) {
	        // If your DTO has Timestamp createdAt:
	        // dto.setCreatedAt(ts);

	        // If your DTO uses java.time.LocalDateTime:
	        // dto.setCreatedAt(ts.toLocalDateTime());

	        // I'll assume DTO stores java.sql.Timestamp. Adjust as required:
	        dto.setCreatedAt(ts);
	    } else {
	        dto.setCreatedAt(null);
	    }

	    // uploaded_docs and profile_image — only map if your DTO has matching fields
	    try {
	        // uploaded_docs may be JSON string (varchar/text), map to String in DTO
	        String uploadedDocs = rs.getString("uploaded_docs");
	        dto.setUploadedDocs(uploadedDocs);
	    } catch (SQLException ignore) {}

	    try {
	        // profile_image might be BLOB; map to byte[] if DTO supports it
	        byte[] profileImage = rs.getBytes("profile_image");
	        dto.setProfileImage(profileImage);
	    } catch (SQLException ignore) {}

	    return dto;

	
	
}
	 @Transactional
	    @Override
	    public boolean disapproveBE(int tempBeId) {
	        final String deleteTempSql = "DELETE FROM temp_bank_employees WHERE temp_be_id = ?";
	        int deleted = jdbcTemplate.update(deleteTempSql, tempBeId);
	        if (deleted != 1) {
	            // this shouldn't happen, rollback the whole transaction by throwing
	            throw new RuntimeException("Failed to delete temp bank manager row: temp_bm_id=" + tempBeId);
	        }

	        return true; // success
	    }

//	@Override
//	public List<TempBankEmployeeDto> getTempBankEmployeesForCurrentBM() {
//		// TODO Auto-generated method stub
//		return null;
//	}

	@Override
    @Transactional
    public Integer approveLoan(int tempLoanId, int userId) {
		Integer bmId;
		try {
            bmId = jdbcTemplate.queryForObject("SELECT bm_id FROM bank_manager WHERE user_id = ?", new Object[]{userId}, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
		// 1) fetch temp_loan row
	    final String fetchSql =
	            "SELECT Temp_Loan_ID, Customer_ID, Amount, Status, Created_At, " +
	            " interest_rate, tenure_months, loan_type " +
	            "FROM temp_loan WHERE Temp_Loan_ID = ?";

	    Map<String, Object> temp;
	    try {
	        temp = jdbcTemplate.queryForMap(fetchSql, tempLoanId);
	    } catch (Exception ex) {
	        throw new RuntimeException("temp loan not found: " + tempLoanId);
	    }

	    // 2) read required values (use Number conversions carefully)
	    Integer customerId =
	            (temp.get("Customer_ID") == null)
	                    ? null
	                    : ((Number) temp.get("Customer_ID")).intValue();
	    if (customerId == null) {
	        throw new RuntimeException("temp loan missing customer_id: " + tempLoanId);
	    }

	    final double amount =
	            ((Number) temp.get("Amount")).doubleValue();
	    final int tenureMonths =
	            ((Number) temp.get("tenure_months")).intValue();
	    final double interestRate =
	            ((Number) temp.get("interest_rate")).doubleValue();
	    final String loanType =
	            String.valueOf(temp.get("loan_type"));
	    final Timestamp createdAt =
	            (Timestamp) temp.get("Created_At");

	    // 3) derive extra fields for loan table
	    final double rate = interestRate; // interestRate already in %
	    final double totalToPay = amount * (1 + rate * tenureMonths / 100.0);
	    final double emiAmount = totalToPay / tenureMonths;
	    final int totalEmis = tenureMonths;
	    final int paidEmis = 0;
	    final double remainingAmount = totalToPay; // nothing paid yet
	    final String emiFrequency = "MONTHLY";
	    final String loanStatus = "ACTIVE";
	    final java.sql.Date issueDate = new java.sql.Date(createdAt.getTime());

	    // 4) insert into loan table
	    final String insertSql =
	            "INSERT INTO loan (" +
	            " cust_id, bm_id, amount, status, issue_date, " +
	            " interest_rate, tenure_months, loan_type, " +
	            " emi_amount, total_emis, paid_emis, " +
	            " next_payment_date, last_payment_date, " +
	            " remaining_amount, emi_frequency, loan_status" +
	            ") VALUES (" +
	            " ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)";

	    KeyHolder kh = new GeneratedKeyHolder();

	    int rows = jdbcTemplate.update(con -> {
	        PreparedStatement ps =
	                con.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
	        int i = 1;
	        ps.setInt(i++, customerId);
	        ps.setInt(i++, bmId);
	        ps.setDouble(i++, amount);
	        ps.setString(i++, "Approved");
	        ps.setDate(i++, issueDate);
	        ps.setDouble(i++, interestRate);
	        ps.setInt(i++, tenureMonths);
	        ps.setString(i++, loanType);
	        ps.setDouble(i++, round2(emiAmount));
	        ps.setInt(i++, totalEmis);
	        ps.setInt(i++, paidEmis);
	        ps.setDouble(i++, round2(remainingAmount));
	        ps.setString(i++, emiFrequency);
	        ps.setString(i++, loanStatus);
	        return ps;
	    }, kh);

	    if (rows != 1) {
	        throw new RuntimeException("failed to create loan record");
	    }

	    Number generated = kh.getKey();
	    if (generated == null) {
	        throw new RuntimeException(
	                "failed to retrieve created loan id for temp_loan: " + tempLoanId);
	    }
	    int loanId = generated.intValue();

	    // 5) delete temp_loan row (mark as processed)
	    int del = jdbcTemplate.update(
	            "DELETE FROM temp_loan WHERE Temp_Loan_ID = ?",
	            tempLoanId
	    );
	    if (del != 1) {
	        // rollback whole transaction
	        throw new RuntimeException(
	                "inserted loan but failed to delete temp_loan after approval: " + tempLoanId);
	    }

	    // 6) success – return created loan id
	    return loanId;
	}

	 @Transactional
	    @Override
	    public boolean disapproveLoan(int tempLoanId) {
	        final String deleteTempSql = "DELETE FROM temp_loan WHERE Temp_Loan_ID = ?";
	        int deleted = jdbcTemplate.update(deleteTempSql, tempLoanId);
	        if (deleted != 1) {
	            // this shouldn't happen, rollback the whole transaction by throwing
	            throw new RuntimeException("Failed to delete temp bank manager row: temp_bm_id=" + tempLoanId);
	        }

	        return true; // success
	    }

	/** helper to round to 2 decimal places */
	private double round2(double value) {
	    return Math.round(value * 100.0) / 100.0;
    }

	@Override
	public List<TempLoanDto> getPendingLoans() {
	    final String sql =
	        "SELECT Temp_Loan_Id, Customer_ID, Amount, interest_rate, tenure_months, " +
	        "       loan_type, Status, created_at " +
	        "FROM temp_loan " +
	        "WHERE status = 'Pending' " +
	        "ORDER BY created_at DESC";

	    return jdbcTemplate.query(sql, (rs, rowNum) -> mapTempLoan(rs));
	}

	}
