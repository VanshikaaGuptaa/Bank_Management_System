package com.bankingsystem.mapper;

import org.springframework.jdbc.core.RowMapper;

import com.bankingsystem.entity.User;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User u = new User();
        u.setUserId(rs.getInt("user_id"));
        u.setUsername(rs.getString("username"));
        u.setPassword(rs.getString("password"));
        u.setEmail(rs.getString("email"));
        u.setPhone(rs.getString("phone"));
        u.setFullName(rs.getString("full_name"));
        u.setRole(rs.getString("role"));
        u.setStatus(rs.getString("status"));
        u.setCreatedAt(rs.getTimestamp("created_at"));
        u.setUploadedDocs(rs.getString("uploaded_docs"));
        // profile_image as blob -> bytes (may be null)
        byte[] img = rs.getBytes("profile_image");
        u.setProfileImage(img);
        return u;
    }
}