package com.bankingsystem.mapper;

import com.bankingsystem.entity.RegionalManager;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RegionalManagerRowMapper implements RowMapper<RegionalManager> {
    @Override
    public RegionalManager mapRow(ResultSet rs, int rowNum) throws SQLException {
        RegionalManager rm = new RegionalManager();
        rm.setRmId(rs.getInt("rm_id"));
        rm.setUserId(rs.getInt("user_id"));
        rm.setAddress(rs.getString("address"));
        // set other fields if present in table
        return rm;
    }
}