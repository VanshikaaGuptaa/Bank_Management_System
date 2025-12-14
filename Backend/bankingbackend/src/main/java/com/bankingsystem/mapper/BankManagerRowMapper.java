package com.bankingsystem.mapper;

import org.springframework.jdbc.core.RowMapper;

import com.bankingsystem.entity.BankManager;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BankManagerRowMapper implements RowMapper<BankManager> {
    @Override
    public BankManager mapRow(ResultSet rs, int rowNum) throws SQLException {
        BankManager bm = new BankManager();
        bm.setBmId(rs.getInt("bm_id"));
        bm.setApprovedByRm(rs.getBoolean("approved_by_rm"));
        bm.setUserId(rs.getInt("user_id"));
        bm.setBranchId(rs.getInt("branch_id"));
        return bm;
    }
}