package com.bankingsystem.service.impl;

import com.bankingsystem.dto.CreateBranchDto;
import com.bankingsystem.dto.CreateRegionalManagerDto;
import com.bankingsystem.dto.TempBankManagerDto;
import com.bankingsystem.dto.UpdateRegionalManagerDto;
import com.bankingsystem.entity.Branch;
import com.bankingsystem.entity.RegionalManager;
import com.bankingsystem.security.SecurityUtil;
import com.bankingsystem.service.RegionalManagerService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RegionalManagerServiceImpl implements RegionalManagerService {
	
	private final JdbcTemplate jdbcTemplate;
	private final PasswordEncoder passwordEncoder;
	 private SecurityUtil securityUtil;
	public RegionalManagerServiceImpl(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder,SecurityUtil securityUtil) {
		this.jdbcTemplate = jdbcTemplate;
		this.passwordEncoder = passwordEncoder;
		this.securityUtil=securityUtil;
	}

    private final RowMapper<RegionalManager> joinedRowMapper = (rs, rowNum) -> {
        RegionalManager rm = new RegionalManager();
        rm.setRmId(rs.getInt("rm_id"));
        rm.setAddress(rs.getString("address"));
        int userId = rs.getInt("user_id");
        if (rs.wasNull()) rm.setUserId(null); else rm.setUserId(userId);

        rm.setUsername(rs.getString("username"));
        rm.setEmail(rs.getString("email"));
        rm.setPhone(rs.getString("phone"));
        rm.setFullName(rs.getString("full_name"));
        rm.setRole(rs.getString("role"));
        rm.setStatus(rs.getString("status"));
        return rm;
    };
    private final RowMapper<Branch> branchRowMapper = (rs, rowNum) -> {
    	
    	Branch branch = new Branch();
        branch.setBranchId(rs.getInt("branch_id"));
        branch.setBranchName(rs.getString("branch_name"));
        branch.setBranchCode(rs.getString("branch_code"));
        branch.setAddress(rs.getString("address"));
        branch.setBranchType(rs.getString("type"));
        branch.setRmId(rs.getInt("rm_id")); // matches schema

        return branch;
    };
   
    @Override
    @Transactional
    public Branch createBranch(CreateBranchDto dto) {
        // Insert user
        String branchSql = "INSERT INTO branch (branch_name, branch_code, address, type, rm_id) " +
                "VALUES (?, ?, ?, ?, ?)";
        KeyHolder userKeyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(branchSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, dto.getBranch_name());
            ps.setString(2, dto.getBranch_code());
            ps.setString(3, dto.getAddress());
            ps.setString(4, dto.getType());
            ps.setInt(5, dto.getrmid());
            return ps;
        }, userKeyHolder);

        Integer branchId = (userKeyHolder.getKey() != null) ? userKeyHolder.getKey().intValue() : null;
        if (branchId == null) throw new DataAccessException("Failed to create branch") {};


        Branch branch = new Branch();
        branch.setBranchId(branchId);
        branch.setAddress(dto.getAddress());
        branch.setBranchName(dto.getBranch_name());
        branch.setBranchCode(dto.getBranch_code());
        branch.setBranchType(dto.getType());
        branch.setRmId(dto.getrmid());
        return branch;
    }
    @Override
    @Transactional
    public boolean deleteBranch(int branchId) {
        // Insert user
    	 Integer branchid;
         try {
             branchid = jdbcTemplate.queryForObject("SELECT branch_id FROM branch WHERE branch_id = ?", new Object[]{branchId}, Integer.class);
         } catch (EmptyResultDataAccessException ex) {
             return false;
         }

         int del = jdbcTemplate.update("DELETE FROM branch WHERE branch_id = ?", branchId);
         if (del == 0) return false;

         

         return true;
    }

    @Override
    @Transactional
    public RegionalManager createRM(CreateRegionalManagerDto dto) {
        // Insert user
        String userSql = "INSERT INTO user (username, password, email, phone, full_name, role, status, created_at, uploaded_docs, profile_image) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)";
        KeyHolder userKeyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, dto.getUsername());
            ps.setString(2, passwordEncoder.encode(dto.getPassword()));
            ps.setString(3, dto.getEmail());
            ps.setString(4, dto.getPhone());
            ps.setString(5, dto.getFullName());
            ps.setString(6, dto.getRole());
            ps.setString(7, dto.getStatus());
            ps.setString(8, "[]");
            ps.setBytes(9, null);
            return ps;
        }, userKeyHolder);

        Integer userId = (userKeyHolder.getKey() != null) ? userKeyHolder.getKey().intValue() : null;
        if (userId == null) throw new DataAccessException("Failed to create user") {};

        // Insert regional_manager
        String rmSql = "INSERT INTO regional_manager (address, user_id) VALUES (?, ?)";
        KeyHolder rmKeyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(rmSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, dto.getAddress());
            ps.setInt(2, userId);
            return ps;
        }, rmKeyHolder);

        Integer rmId = (rmKeyHolder.getKey() != null) ? rmKeyHolder.getKey().intValue() : null;

        RegionalManager rm = new RegionalManager();
        rm.setRmId(rmId);
        rm.setAddress(dto.getAddress());
        rm.setUserId(userId);
        rm.setUsername(dto.getUsername());
        rm.setEmail(dto.getEmail());
        rm.setPhone(dto.getPhone());
        rm.setFullName(dto.getFullName());
        rm.setRole(dto.getRole());
        rm.setStatus(dto.getStatus());
        return rm;
    }

    @Override
    public RegionalManager getRMById(Integer id) {
        String sql = "SELECT rm.rm_id, rm.address, rm.user_id, " +
                "u.username, u.email, u.phone, u.full_name, u.role, u.status " +
                "FROM regional_manager rm JOIN user u ON rm.user_id = u.user_id WHERE rm.rm_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{id}, joinedRowMapper);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public List<RegionalManager> getAllRM() {
        String sql = "SELECT rm.rm_id, rm.address, rm.user_id, " +
                "u.username, u.email, u.phone, u.full_name, u.role, u.status " +
                "FROM regional_manager rm JOIN user u ON rm.user_id = u.user_id";
        return jdbcTemplate.query(sql, joinedRowMapper);
    }
    @Override
    public List<Branch> getAllBranches() {
    	String sql = "SELECT branch_id,branch_name,branch_code,address,type,rm_id " +
    			"FROM branch";
    	return jdbcTemplate.query(sql, branchRowMapper);
    }

    @Override
    @Transactional
    public RegionalManager updateRM(Integer rmId, UpdateRegionalManagerDto dto) {
        // get user_id
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject("SELECT user_id FROM regional_manager WHERE rm_id = ?", new Object[]{rmId}, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }

        // update regional_manager
        jdbcTemplate.update("UPDATE regional_manager SET address = COALESCE(?, address) WHERE rm_id = ?", dto.getAddress(), rmId);

        // username uniqueness if provided
        if (dto.getUsername() != null) {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM user WHERE username = ? AND user_id <> ?", new Object[]{dto.getUsername(), userId}, Integer.class);
            if (count != null && count > 0) throw new IllegalArgumentException("username already in use");
            jdbcTemplate.update("UPDATE user SET username = ? WHERE user_id = ?", dto.getUsername(), userId);
        }

        // update user fields individually
        if (dto.getEmail() != null) jdbcTemplate.update("UPDATE user SET email = ? WHERE user_id = ?", dto.getEmail(), userId);
        if (dto.getPhone() != null) jdbcTemplate.update("UPDATE user SET phone = ? WHERE user_id = ?", dto.getPhone(), userId);
        if (dto.getFullName() != null) jdbcTemplate.update("UPDATE user SET full_name = ? WHERE user_id = ?", dto.getFullName(), userId);
        if (dto.getRole() != null) jdbcTemplate.update("UPDATE user SET role = ? WHERE user_id = ?", dto.getRole(), userId);
        if (dto.getStatus() != null) jdbcTemplate.update("UPDATE user SET status = ? WHERE user_id = ?", dto.getStatus(), userId);
        if (dto.getPassword() != null) jdbcTemplate.update("UPDATE user SET password = ? WHERE user_id = ?", passwordEncoder.encode(dto.getPassword()), userId);

        return getRMById(rmId);
    }

    @Override
    @Transactional
    public boolean deleteRM(Integer rmId) {
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject("SELECT user_id FROM regional_manager WHERE rm_id = ?", new Object[]{rmId}, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            return false;
        }

        int del = jdbcTemplate.update("DELETE FROM regional_manager WHERE rm_id = ?", rmId);
        if (del == 0) return false;

        Integer totalRefs = jdbcTemplate.queryForObject(
                "SELECT (SELECT COUNT(1) FROM bank_employee WHERE user_id = ?) + " +
                "(SELECT COUNT(1) FROM bank_manager WHERE user_id = ?) + " +
                "(SELECT COUNT(1) FROM regional_manager WHERE user_id = ?) AS total",
                new Object[]{userId, userId, userId},
                Integer.class
        );

        if (totalRefs == null) totalRefs = 0;
        if (totalRefs == 0) {
            jdbcTemplate.update("DELETE FROM user WHERE user_id = ?", userId);
        }

        return true;
    }
    @Transactional
    public Integer approveTempBankManager(int tempBmId, int rmUserId, String comment) {
      // 1) read temp row
      final String selectTempSql =
        "SELECT temp_bm_id, username, password, email, phone, full_name, role, status, branch_id, created_at " +
        "FROM temp_bank_managers WHERE temp_bm_id = ?";
      Map<String, Object> tempRow;
      try {
        tempRow = jdbcTemplate.queryForMap(selectTempSql, tempBmId);
      } catch (EmptyResultDataAccessException ex) {
        throw new RuntimeException("temp_bank_managers row not found for id=" + tempBmId);
      }

      // 2) validate required fields
      String username = (String) tempRow.get("username");
      String rawPassword = (String) tempRow.get("password");
      if (username == null || username.trim().isEmpty() ||
          rawPassword == null || rawPassword.trim().isEmpty()) {
        throw new IllegalArgumentException("username and password are required in temp row id=" + tempBmId);
      }

      // 3) insert into user (encode password)
      final String insertUserSql =
        "INSERT INTO user (username, password, email, phone, full_name, role, status, created_at) " +
        "VALUES (?, ?, ?, ?, ?, ?, 'Active', ?)";
      String encodedPassword = passwordEncoder.encode(rawPassword);

      KeyHolder userKeyHolder = new GeneratedKeyHolder();
      jdbcTemplate.update(conn -> {
        PreparedStatement ps = conn.prepareStatement(insertUserSql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, username);
        ps.setString(2, encodedPassword);
        ps.setString(3, (String) tempRow.get("email"));
        ps.setString(4, (String) tempRow.get("phone"));
        ps.setString(5, (String) tempRow.get("full_name"));
        ps.setString(6, (String) tempRow.get("role"));
//        ps.setString(7, (String) tempRow.get("status"));
        // created_at column: may be TIMESTAMP or DATETIME; pass object or null
        ps.setObject(7, tempRow.get("created_at"));
        return ps;
      }, userKeyHolder);

      Number userKey = userKeyHolder.getKey();
      if (userKey == null) {
        throw new RuntimeException("Failed to create user for temp id=" + tempBmId);
      }
      Integer userId = userKey.intValue();

      // 4) insert into bank_manager — set approved_by_rm to rmUserId
      final String insertBmSql =
        "INSERT INTO bank_manager (approved_by_rm, user_id, branch_id) VALUES (?, ?, ?)";
      KeyHolder bmKeyHolder = new GeneratedKeyHolder();
      jdbcTemplate.update(conn -> {
        PreparedStatement ps = conn.prepareStatement(insertBmSql, Statement.RETURN_GENERATED_KEYS);
        // approved_by_rm
        if (rmUserId > 0) ps.setInt(1, rmUserId); else ps.setNull(1, Types.INTEGER);
        ps.setInt(2, userId);
        Object branchObj = tempRow.get("branch_id");
        if (branchObj == null) ps.setNull(3, Types.INTEGER);
        else ps.setInt(3, ((Number) branchObj).intValue());
        return ps;
      }, bmKeyHolder);

      Number bmKey = bmKeyHolder.getKey();
      if (bmKey == null) {
        throw new RuntimeException("Failed to create bank_manager for temp id=" + tempBmId);
      }
      Integer bmId = bmKey.intValue();

      // 5) delete temp row
      final String deleteTempSql = "DELETE FROM temp_bank_managers WHERE temp_bm_id = ?";
      int deleted = jdbcTemplate.update(deleteTempSql, tempBmId);
      if (deleted != 1) {
        // should rollback because of @Transactional
        throw new RuntimeException("Failed to delete temp row temp_bm_id=" + tempBmId);
      }

      // 6) optionally return created bmId (or userId if you prefer)
      return bmId;
    }
    @Transactional
    @Override
    public boolean approveBM(int tempBmId) {
        // 1) fetch temp row
        final String selectTempSql =
            "SELECT temp_bm_id, username, password, email, phone, full_name, role, status, branch_id, created_at " +
            "FROM temp_bank_managers WHERE temp_bm_id = ?";

        Map<String, Object> tempRow;
        try {
            tempRow = jdbcTemplate.queryForMap(selectTempSql, tempBmId);
        } catch (EmptyResultDataAccessException ex) {
            throw new RuntimeException("No temp bank manager found for id=" + tempBmId);
        }

        // required fields
        String username = (String) tempRow.get("username");
        String rawPassword = (String) tempRow.get("password");
        String email = (String) tempRow.get("email");
        String phone = (String) tempRow.get("phone");
        String fullName = (String) tempRow.get("full_name");
        String role = (String) tempRow.get("role");
        String status = (String) tempRow.get("status");
        Integer branchId = tempRow.get("branch_id") == null ? null : ((Number) tempRow.get("branch_id")).intValue();
        Timestamp createdAt = (Timestamp) tempRow.get("created_at");

        if (username == null || rawPassword == null || username.trim().isEmpty() || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("username and password are required in temp_bank_managers row: " + tempBmId);
        }

        // 2) create user
        final String insertUserSql =
            "INSERT INTO user (username, password, email, phone, full_name, role, status, created_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        final String encodedPassword = passwordEncoder.encode(rawPassword);
        KeyHolder userKeyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(insertUserSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, username);
            ps.setString(2, encodedPassword);
            ps.setString(3, email);
            ps.setString(4, phone);
            ps.setString(5, fullName);
            ps.setString(6, role);
            ps.setString(7, status);
            // created_at may be null in temp table; if null set to null else set timestamp
            if (createdAt != null) ps.setTimestamp(8, createdAt); else ps.setTimestamp(8, null);
            return ps;
        }, userKeyHolder);

        Number userIdNum = userKeyHolder.getKey();
        if (userIdNum == null) {
            throw new RuntimeException("failed to create user for temp_bm_id=" + tempBmId);
        }
        int userId = userIdNum.intValue();
        final Integer branchIdFinal=branchId;
        // 3) insert into bank_manager table (real)
        final String insertBankManagerSql =
            "INSERT INTO bank_manager (user_id, branch_id) VALUES (?, ?)";

        jdbcTemplate.update(insertBankManagerSql, userId, branchIdFinal);

        // 4) delete temp row
        final String deleteTempSql = "DELETE FROM temp_bank_managers WHERE temp_bm_id = ?";
        int deleted = jdbcTemplate.update(deleteTempSql, tempBmId);
        if (deleted != 1) {
            // this shouldn't happen, rollback the whole transaction by throwing
            throw new RuntimeException("Failed to delete temp bank manager row: temp_bm_id=" + tempBmId);
        }

        return true; // success
    }
    @Transactional
    @Override
    public boolean disapproveBM(int tempBmId) {
        final String deleteTempSql = "DELETE FROM temp_bank_managers WHERE temp_bm_id = ?";
        int deleted = jdbcTemplate.update(deleteTempSql, tempBmId);
        if (deleted != 1) {
            // this shouldn't happen, rollback the whole transaction by throwing
            throw new RuntimeException("Failed to delete temp bank manager row: temp_bm_id=" + tempBmId);
        }

        return true; // success
    }
    
    @Override
    public boolean updateProfile(Integer rmId,
                                 String username,
                                 String fullName,
                                 String email,
                                 String phone,
                                 String address,
                                 MultipartFile image) {

        try {
            // 1) find user_id for this rm
            String findUserSql = "SELECT user_id FROM regional_manager WHERE rm_id = ?";
            Integer userId = jdbcTemplate.queryForObject(
                    findUserSql,
                    new Object[]{rmId},
                    Integer.class
            );

            if (userId == null) {
                return false;
            }

            // 2) update regional_manager.address (if provided)
            if (address != null) {
                String updateRmSql =
                        "UPDATE regional_manager SET address = COALESCE(?, address) WHERE rm_id = ?";
                jdbcTemplate.update(updateRmSql, address, rmId);
            }

            // 3) update fields in user table (only when not null)
            if (username != null) {
                jdbcTemplate.update(
                        "UPDATE user SET username = ? WHERE user_id = ?",
                        username, userId
                );
            }
            if (fullName != null) {
                jdbcTemplate.update(
                        "UPDATE user SET full_name = ? WHERE user_id = ?",
                        fullName, userId
                );
            }
            if (email != null) {
                jdbcTemplate.update(
                        "UPDATE user SET email = ? WHERE user_id = ?",
                        email, userId
                );
            }
            if (phone != null) {
                jdbcTemplate.update(
                        "UPDATE user SET phone = ? WHERE user_id = ?",
                        phone, userId
                );
            }

            // 4) update profile_image (BLOB) in user table
            if (image != null && !image.isEmpty()) {
                byte[] bytes = image.getBytes();
                jdbcTemplate.update(
                        "UPDATE user SET profile_image = ? WHERE user_id = ?",
                        bytes, userId
                );
            }

            return true;
        } catch (EmptyResultDataAccessException ex) {
            // no RM row for given rmId
            return false;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to read profile image bytes", ex);
        }
    }
    @Override
    public byte[] getProfileImage(Integer rmId) {

        try {
            // 1) find user id for rm
            String sqlUserId = "SELECT user_id FROM regional_manager WHERE rm_id = ?";
            Integer userId = jdbcTemplate.queryForObject(sqlUserId, new Object[]{rmId}, Integer.class);

            if (userId == null) return null;

            // 2) fetch the BLOB
            String sqlImg = "SELECT profile_image FROM user WHERE user_id = ?";
            return jdbcTemplate.queryForObject(sqlImg, new Object[]{userId}, byte[].class);

        } catch (Exception ex) {
            return null;
        }
    }
    @Override
    public List<TempBankManagerDto> getTempBankManagersForUser(Integer currentUserId) {

        if (currentUserId == null) {
            return Collections.emptyList();
        }

        // 1) Find RM record for this user
        final String sqlRm = "SELECT rm_id FROM regional_manager WHERE user_id = ?";
        Integer rmId;
        try {
            rmId = jdbcTemplate.queryForObject(sqlRm, Integer.class, currentUserId);
        } catch (EmptyResultDataAccessException ex) {
            return Collections.emptyList(); // not an RM
        }

        // 2) Find all branch_ids handled by this RM
        final String sqlBranches = "SELECT branch_id FROM branch WHERE rm_id = ?";
        List<Integer> branchIds = jdbcTemplate.queryForList(sqlBranches, Integer.class, rmId);
        if (branchIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 3) Fetch temp bank managers for those branches
        final String sql =
            "SELECT temp_bm_id, username, password, email, phone, full_name, role, status, branch_id, created_at " +
            "FROM temp_bank_managers WHERE branch_id IN (" +
            branchIds.stream().map(id -> "?").collect(Collectors.joining(",")) +
            ") ORDER BY created_at DESC";

        Object[] params = branchIds.toArray();

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            TempBankManagerDto dto = new TempBankManagerDto();
            dto.setTempBmId(rs.getInt("temp_bm_id"));
            dto.setUsername(rs.getString("username"));
            dto.setPassword(rs.getString("password"));
            dto.setEmail(rs.getString("email"));
            dto.setPhone(rs.getString("phone"));
            dto.setFullName(rs.getString("full_name"));
            dto.setRole(rs.getString("role"));
            dto.setStatus(rs.getString("status"));
            dto.setBranchId(rs.getInt("branch_id"));
            dto.setCreatedAt(rs.getTimestamp("created_at"));
            
            return dto;
        });
    
    
        
        
}}
