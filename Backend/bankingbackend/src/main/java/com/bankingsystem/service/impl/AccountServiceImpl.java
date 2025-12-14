package com.bankingsystem.service.impl;

import com.bankingsystem.dto.CloseAccountRequestDto;
import com.bankingsystem.dto.CreateAccountDto;
import com.bankingsystem.dto.DepositWithdrawDto;
import com.bankingsystem.entity.Account;
import com.bankingsystem.entity.Transaction;
import com.bankingsystem.service.AccountService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Random;

@Service
public class AccountServiceImpl implements AccountService {

    private final JdbcTemplate jdbcTemplate;

    public AccountServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // simple random account number generator
    private String generateAccNo() {
        return "AC" + System.currentTimeMillis() + new Random().nextInt(1000);
    }

    @Override
    public Account createAccount(CreateAccountDto dto) {
    	// 1) check if this customer already has an account
        final String checkSql = "SELECT COUNT(*) FROM account WHERE cust_id = ?";
        Integer existing = jdbcTemplate.queryForObject(checkSql,
                Integer.class,
                dto.getCustId());

        if (existing == null || existing == 0) {
            // no existing account for this customer → do NOT create new one
            throw new RuntimeException(
                    "Cannot create account. No existing account found for customer_id: "
                            + dto.getCustId());
        }

        // 2) generate new account number
        String accNo = generateAccNo();

        // 3) create the new account
        String sql =
                "INSERT INTO account (acc_no, cust_id, acc_type, balance, opened_date, status) " +
                "VALUES (?, ?, ?, 0.0, CURRENT_DATE, 'Active')";

        jdbcTemplate.update(sql,
                accNo,
                dto.getCustId(),
                dto.getAccType());

        // 4) return the created account
        return getByAccNo(accNo);
    }

    @Override
    public Account getByAccNo(String accNo) {
        String sql = "SELECT * FROM account WHERE acc_no = ?";
        try {
            return jdbcTemplate.queryForObject(sql, this::mapAccount, accNo);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public List<Account> getByCustomer(Integer custId) {
        String sql = "SELECT * FROM account WHERE cust_id = ?";
        return jdbcTemplate.query(sql, this::mapAccount, custId);
    }

    @Override
    public Double deposit(DepositWithdrawDto dto) {
        Account acc = getByAccNo(dto.getAccNo());
        if (acc == null) throw new RuntimeException("Account not found");

        double newBalance = acc.getBalance() + dto.getAmount();

        jdbcTemplate.update("UPDATE account SET balance = ? WHERE acc_no = ?",
                newBalance, dto.getAccNo());

        String tSql = "INSERT INTO transaction (acc_no, trans_type, amount, trans_date, remarks, balance_after) " +
                      "VALUES (?, 'Credit', ?, NOW(), ?, ?)";

        jdbcTemplate.update(tSql,
                dto.getAccNo(),
                dto.getAmount(),
                dto.getRemarks(),
                newBalance);

        return newBalance;
    }
    @Override
    public List<Account> getAccountSummaryReport() {
    	String sql = """
    			SELECT a.acc_id, a.acc_no, a.cust_id, a.acc_type, a.balance, a.opened_date, a.status
    			FROM account a
    			WHERE a.status = 'Active'
    			""";
    	return jdbcTemplate.query(sql, this::mapAccount);
    }
    @Override
    public Double withdraw(DepositWithdrawDto dto) {
        Account acc = getByAccNo(dto.getAccNo());
        if (acc == null) throw new RuntimeException("Account not found");

        if (acc.getBalance() < dto.getAmount()) {
            throw new RuntimeException("Insufficient balance");
        }

        double newBalance = acc.getBalance() - dto.getAmount();

        jdbcTemplate.update("UPDATE account SET balance = ? WHERE acc_no = ?",
                newBalance, dto.getAccNo());

        String tSql = "INSERT INTO transaction (acc_no, trans_type, amount, trans_date, remarks, balance_after) " +
                      "VALUES (?, 'Debit', ?, NOW(), ?, ?)";

        jdbcTemplate.update(tSql,
                dto.getAccNo(),
                dto.getAmount(),
                dto.getRemarks(),
                newBalance);

        return newBalance;
    }

    @Override
    public boolean closeAccount(CloseAccountRequestDto req) {

        // 1. Check account exists and belongs to this customer
        String sql = "SELECT balance FROM account WHERE acc_no = ? AND cust_id = ?";

        try {
            Double balance = jdbcTemplate.queryForObject(sql, Double.class, req.getAccNo(), req.getCustId());

            if (balance == null)
                throw new RuntimeException("Account not found!");

            // 2. Stop closure if money is present
            if (balance > 0)
                throw new RuntimeException("Withdraw remaining balance before closing account");

            // 3. If balance = 0 → close account 
            String update = "UPDATE account SET status='CLOSED', closed_date = NOW() WHERE acc_no=? AND cust_id=?";
            jdbcTemplate.update(update, req.getAccNo(), req.getCustId());

            return true;

        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Invalid account or customer");
        }
    }

    @Override
    public List<Transaction> getMiniStatement(String accNo) {
        String sql = "SELECT * FROM transaction WHERE acc_no = ? " +
                     "ORDER BY trans_date DESC LIMIT 10";
        return jdbcTemplate.query(sql, this::mapTransaction, accNo);
    }

    @Override
    public List<Transaction> getStatement(String accNo, String fromDate, String toDate) {
        String sql = "SELECT * FROM transaction WHERE acc_no = ? " +
                     "AND DATE(trans_date) BETWEEN ? AND ? " +
                     "ORDER BY trans_date";
        return jdbcTemplate.query(sql, this::mapTransaction, accNo, fromDate, toDate);
    }
    @Override
    public void transfer(String fromAcc, String toAcc, Double amount) {
        // 1. Fetch both accounts
        Account from = getByAccNo(fromAcc);
        if (from == null) throw new RuntimeException("From account not found");

        Account to = getByAccNo(toAcc);
        if (to == null) throw new RuntimeException("To account not found");

        // 2. Check sufficient balance
        if (from.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // 3. Update balances
        double newFromBalance = from.getBalance() - amount;
        double newToBalance = to.getBalance() + amount;

        // Update FROM account balance
        jdbcTemplate.update(
            "UPDATE account SET balance = ? WHERE acc_no = ?",
            newFromBalance, fromAcc
        );

        // Update TO account balance
        jdbcTemplate.update(
            "UPDATE account SET balance = ? WHERE acc_no = ?",
            newToBalance, toAcc
        );

        // 4. Insert transaction for FROM account (Debit)
        jdbcTemplate.update(
            "INSERT INTO transaction (acc_no, trans_type, amount, trans_date, remarks, balance_after) " +
            "VALUES (?, 'Debit', ?, NOW(), ?, ?)",
            fromAcc, amount, "Transfer to " + toAcc, newFromBalance
        );

        // 5. Insert transaction for TO account (Credit)
        jdbcTemplate.update(
            "INSERT INTO transaction (acc_no, trans_type, amount, trans_date, remarks, balance_after) " +
            "VALUES (?, 'Credit', ?, NOW(), ?, ?)",
            toAcc, amount, "Transfer from " + fromAcc, newToBalance
        );
    }

    // RowMappers
    private Account mapAccount(ResultSet rs, int rowNum) throws SQLException {
        Account a = new Account();
        a.setAccId(rs.getInt("acc_id"));
        a.setAccNo(rs.getString("acc_no"));
        a.setCustId(rs.getInt("cust_id"));
        a.setAccType(rs.getString("acc_type"));
        a.setBalance(rs.getDouble("balance"));
        a.setOpenedDate(rs.getDate("opened_date"));
        a.setStatus(rs.getString("status"));
        return a;
    }

    private Transaction mapTransaction(ResultSet rs, int rowNum) throws SQLException {
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
    
    @Override
    public Account createAccountByEmployee(CreateAccountDto dto) {
        if (dto.getCustId() == null) {
            throw new IllegalArgumentException("custId is required");
        }
        if (dto.getAccType() == null || dto.getAccType().trim().isEmpty()) {
            throw new IllegalArgumentException("accType is required");
        }

        // 1) ensure customer exists
        final String checkCustomerSql = "SELECT COUNT(*) FROM customer WHERE cust_id = ?";
        Integer custCount = jdbcTemplate.queryForObject(checkCustomerSql, Integer.class, dto.getCustId());
        if (custCount == null || custCount == 0) {
            throw new IllegalArgumentException("Customer with id " + dto.getCustId() + " does not exist");
        }

        // 2) generate account number (same style as your existing method)
        String accNo = generateAccNo();

        // 3) insert into account (no "must already have account" check)
        final String insertSql =
                "INSERT INTO account (acc_no, cust_id, acc_type, balance, opened_date, status) " +
                "VALUES (?, ?, ?, 0.0, CURRENT_DATE, 'Active')";

        jdbcTemplate.update(insertSql, accNo, dto.getCustId(), dto.getAccType());

        // 4) return created account
        return getByAccNo(accNo);
    }

}


