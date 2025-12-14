package com.bankingsystem.service.impl;
 
import com.bankingsystem.dto.CreateSubsequentAccountDto;
import com.bankingsystem.entity.SubsequentAccount;
import com.bankingsystem.exception.BadRequestException;
import com.bankingsystem.service.SubsequentAccountService;
 
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
 
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
 
@Service
public class SubsequentAccountServiceImpl implements SubsequentAccountService {
 
    private final JdbcTemplate jdbc;
 
    public SubsequentAccountServiceImpl(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }
 
    @Override
    public SubsequentAccount create(CreateSubsequentAccountDto dto) {
        // Optional validation: ensure primary account exists
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM account WHERE cust_id = ?",
            Integer.class,
            dto.getCustomerId()
        );
        if (count == null || count == 0) {
            throw new BadRequestException("Customer must have a primary account before creating FD/RD.");
        }
 
        SubsequentAccount acc = new SubsequentAccount();
        acc.setAccountNo(dto.getAccountNo());
        acc.setCustomerId(dto.getCustomerId());
        acc.setType(dto.getType());
        acc.setAmount(dto.getAmount());
        acc.setInterestRate(dto.getInterestRate());
        acc.setStartDate(LocalDate.parse(dto.getStartDate()));
        acc.setMaturityDate(LocalDate.parse(dto.getMaturityDate()));
        acc.setStatus("ACTIVE");
        acc.setCreatedAt(LocalDateTime.now());
 
        String sql = "INSERT INTO subsequent_account " +
                "(account_no, customer_id, type, amount, interest_rate, start_date, maturity_date, status, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbc.update(sql,
            acc.getAccountNo(), acc.getCustomerId(), acc.getType(), acc.getAmount(),
            acc.getInterestRate(), acc.getStartDate(), acc.getMaturityDate(),
            acc.getStatus(), acc.getCreatedAt()
        );
 
        return acc;
    }
 
    @Override
    public SubsequentAccount getById(Integer id) {
        String sql = "SELECT * FROM subsequent_account WHERE sub_acc_id = ? AND status != 'DELETED'";
        try {
            return jdbc.queryForObject(sql, this::mapRow, id);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }
 
    @Override
    public List<SubsequentAccount> getAll() {
        String sql = "SELECT * FROM subsequent_account WHERE status != 'DELETED' ORDER BY created_at DESC";
        return jdbc.query(sql, this::mapRow);
    }
 
    @Override
    public SubsequentAccount deposit(Integer id, Double amount) {
        if (amount < 0) throw new BadRequestException("Deposit amount must be positive");
 
        SubsequentAccount acc = getById(id);
        if (acc == null) throw new BadRequestException("Account not found");
 
        acc.setAmount(acc.getAmount() + amount);
        jdbc.update("UPDATE subsequent_account SET amount = ? WHERE sub_acc_id = ?", acc.getAmount(), id);
 
        return acc;
    }
 
    @Override
    public SubsequentAccount withdraw(Integer id, Double amount) {
        if (amount < 0) throw new BadRequestException("Withdraw amount must be positive");
 
        SubsequentAccount acc = getById(id);
        if (acc == null) throw new BadRequestException("Account not found");
        if (acc.getAmount() < amount) throw new BadRequestException("Insufficient balance");
 
        acc.setAmount(acc.getAmount() - amount);
        jdbc.update("UPDATE subsequent_account SET amount = ? WHERE sub_acc_id = ?", acc.getAmount(), id);
 
        return acc;
    }
 
    @Override
    public void delete(Integer id) {
        SubsequentAccount acc = getById(id);
        if (acc == null) throw new BadRequestException("Account not found");
        if (acc.getAmount() != 0.0) throw new BadRequestException("Cannot close account: balance must be zero");
 
        jdbc.update("DELETE FROM subsequent_account WHERE sub_acc_id = ?", id);
    }
 
    @Override
    public void softDelete(Integer id, Integer performedBy) {
        SubsequentAccount acc = getById(id);
        if (acc == null) throw new BadRequestException("Account not found");
        if (acc.getAmount() != 0.0) throw new BadRequestException("Cannot close account: balance must be zero");
 
        acc.setStatus("DELETED");
        acc.setDeletedBy(performedBy);
        acc.setDeletedAt(LocalDateTime.now());
 
        jdbc.update("UPDATE subsequent_account SET status = 'DELETED', deleted_by = ?, deleted_at = ? WHERE sub_acc_id = ?",
            performedBy, acc.getDeletedAt(), id);
    }
 
    @Override
    public void restore(Integer id) {
        SubsequentAccount acc = getById(id);
        if (acc == null) throw new BadRequestException("Account not found");
        if ("ACTIVE".equalsIgnoreCase(acc.getStatus())) throw new BadRequestException("Account is already active");
 
        acc.setStatus("ACTIVE");
        acc.setDeletedBy(null);
        acc.setDeletedAt(null);
 
        jdbc.update("UPDATE subsequent_account SET status = 'ACTIVE', deleted_by = NULL, deleted_at = NULL WHERE sub_acc_id = ?", id);
    }
 
    // RowMapper method
    private SubsequentAccount mapRow(ResultSet rs, int rowNum) throws SQLException {
        SubsequentAccount acc = new SubsequentAccount();
        acc.setSubAccId(rs.getInt("sub_acc_id"));
        acc.setAccountNo(rs.getString("account_no"));
        acc.setCustomerId(rs.getInt("customer_id"));
        acc.setType(rs.getString("type"));
        acc.setAmount(rs.getDouble("amount"));
        acc.setInterestRate(rs.getDouble("interest_rate"));
        acc.setStartDate(rs.getDate("start_date").toLocalDate());
        acc.setMaturityDate(rs.getDate("maturity_date").toLocalDate());
        acc.setStatus(rs.getString("status"));
        acc.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        acc.setDeletedBy(rs.getObject("deleted_by") != null ? rs.getInt("deleted_by") : null);
        acc.setDeletedAt(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        return acc;
    }
}