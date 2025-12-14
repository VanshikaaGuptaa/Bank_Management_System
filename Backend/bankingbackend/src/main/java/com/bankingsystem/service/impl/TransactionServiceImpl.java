package com.bankingsystem.service.impl;

import com.bankingsystem.dto.TransactionFilterDto;
import com.bankingsystem.entity.Transaction;
import com.bankingsystem.service.TransactionService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final JdbcTemplate jdbcTemplate;

    public TransactionServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Transaction> getAll() {
        return jdbcTemplate.query("SELECT * FROM transaction ORDER BY trans_date DESC", this::mapRow);
    }

    @Override
    public List<Transaction> getByAccNo(String accNo) {
        String sql = "SELECT * FROM transaction WHERE acc_no = ? ORDER BY trans_date DESC";
        return jdbcTemplate.query(sql, this::mapRow, accNo);
    }

    @Override
    public List<Transaction> getMiniStatement(String accNo) {
        String sql = "SELECT * FROM transaction WHERE acc_no = ? ORDER BY trans_date DESC LIMIT 10";
        return jdbcTemplate.query(sql, this::mapRow, accNo);
    }

    @Override
    public List<Transaction> getStatement(TransactionFilterDto dto) {
        String sql = "SELECT * FROM transaction WHERE acc_no = ? " +
                "AND DATE(trans_date) BETWEEN ? AND ? ORDER BY trans_date";
        return jdbcTemplate.query(sql, this::mapRow,
                dto.getAccNo(),
                dto.getFromDate(),
                dto.getToDate());
    }

    @Override
    public Transaction getById(Integer id) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM transaction WHERE trans_id = ?",
                    this::mapRow, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
    @Override
    public List<Map<String, Object>> getTransactionTrends(String fromDate, String toDate, String trendType) {
        String subLabel;

        switch (trendType.toLowerCase()) {
            case "weekly":
                subLabel = "CONCAT(YEAR(trans_date), '-W', LPAD(WEEK(trans_date, 3), 2, '0'))";
                break;
            case "monthly":
                subLabel = "CONCAT(YEAR(trans_date), '-', LPAD(MONTH(trans_date), 2, '0'))";
                break;
            default: // daily
                subLabel = "DATE(trans_date)";
        }

        String sql = "SELECT label, COUNT(*) AS count, SUM(amount) AS totalAmount " +
                     "FROM ( " +
                     " SELECT " + subLabel + " AS label, amount " +
                     " FROM bank_mgmt_system.transaction " +
                     " WHERE DATE(trans_date) BETWEEN ? AND ? " +
                     ") AS sub " +
                     "GROUP BY label " +
                     "ORDER BY label";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("label", rs.getString("label"));
            map.put("count", rs.getInt("count"));
            map.put("totalAmount", rs.getDouble("totalAmount"));
            return map;
        }, fromDate, toDate);
    }
    private Transaction mapRow(ResultSet rs, int rowNum) throws SQLException {
        Transaction t = new Transaction();
        t.setTransId(rs.getInt("trans_id"));
        t.setAccNo(rs.getString("acc_no"));
        t.setTransType(rs.getString("trans_type"));
        t.setAmount(rs.getDouble("amount"));
        t.setTransDate(rs.getTimestamp("trans_date"));
        t.setRemarks(rs.getString("remarks"));
        t.setBalanceAfter(rs.getDouble("balance_after"));
        return t;
    }
}

