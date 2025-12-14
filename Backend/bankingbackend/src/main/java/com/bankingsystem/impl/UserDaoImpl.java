package com.bankingsystem.impl;
import com.bankingsystem.mapper.UserRowMapper;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.bankingsystem.dao.UserDao;
import com.bankingsystem.entity.User;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;
import com.bankingsystem.dto.BankManagerDto;
@Repository
public class UserDaoImpl implements UserDao {

    private final JdbcTemplate jdbc;

    public UserDaoImpl(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Override
    public Optional<User> findById(Integer id) {
        String sql = "SELECT * FROM user WHERE user_id = ?";
        List<User> list = jdbc.query(sql, new UserRowMapper(), id);
        return list.stream().findFirst();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM user WHERE username = ?";
        List<User> list = jdbc.query(sql, new UserRowMapper(), username);
        return list.stream().findFirst();
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM user";
        return jdbc.query(sql, new UserRowMapper());
    }

    @Override
    public int save(BankManagerDto dto) {
        String sql = "INSERT INTO user (username, password, email, phone, full_name, role, status, uploaded_docs, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, dto.getUsername());
            ps.setString(2, dto.getPassword());
            ps.setString(3, dto.getEmail());
            ps.setString(4, dto.getPhone());
            ps.setString(5, dto.getFullName());
            ps.setString(6, dto.getRole());
            ps.setString(7, dto.getStatus());
            ps.setString(8, dto.getUploadedDocs());
            ps.setBytes(9, dto.getProfileImage());
            return ps;
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    @Override
    public int update(User user) {
        String sql = "UPDATE user SET username=?, password=?, email=?, phone=?, full_name=?, role=?, status=?, uploaded_docs=?, profile_image=? WHERE user_id=?";
        return jdbc.update(sql,
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getPhone(),
                user.getFullName(),
                user.getRole(),
                user.getStatus(),
                user.getUploadedDocs(),
                user.getProfileImage(),
                user.getUserId());
    }

    @Override
    public int deleteById(Integer id) {
        String sql = "DELETE FROM user WHERE user_id = ?";
        return jdbc.update(sql, id);
    }
}