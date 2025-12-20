package com.bankingsystem.service.impl;

import com.bankingsystem.dto.CreateLoanDto;
import com.bankingsystem.dto.EmiPaymentDto;
import com.bankingsystem.dto.LoanDecisionDto;
import com.bankingsystem.entity.Loan;
import com.bankingsystem.service.LoanService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanServiceImpl implements LoanService {

    private final JdbcTemplate jdbcTemplate;

    public LoanServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public Loan applyLoan(CreateLoanDto dto) {

    	 double rate = (dto.getInterestRate() != null) ? dto.getInterestRate() : 10.0;
         int tenure = dto.getTenureMonths();
         double amount = dto.getAmount();

         // very simple EMI approx: total = amount * (1 + r/100)
//         double totalPay = amount * (1 + rate / 100.0);
//         double emi = totalPay / tenure;

         String sql = "INSERT INTO temp_loan " +
                 "(Customer_ID, Amount, Status, Created_At, interest_rate, tenure_months, loan_type)" +
                 "VALUES (?, ?, 'Pending', NOW(), ?, ?, ?)";

         jdbcTemplate.update(sql,
                 dto.getCustId(),
                 amount,
                 rate,
                 tenure,
                 dto.getLoanType()
                 
         );

         Integer id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
         return getById(id);
    }


    @Override
    @Transactional
    public Loan decideLoan(LoanDecisionDto dto) {

        Loan l = getById(dto.getLoanId());
        if (l == null) throw new RuntimeException("Loan not found");

        if (dto.isApprove()) {
            LocalDate today = LocalDate.now();
            LocalDate next = today.plusMonths(1);

            String sql = "UPDATE loan SET status='Approved', bm_id=?, issue_date=?, " +
                         "loan_status='Ongoing', next_payment_date=? WHERE loan_id=?";

            jdbcTemplate.update(sql,
                    dto.getBmId(),
                    Date.valueOf(today),
                    Date.valueOf(next),
                    dto.getLoanId());
        } else {
            String sql = "UPDATE loan SET status='Rejected', bm_id=?, loan_status='Rejected' " +
                         "WHERE loan_id=?";
            jdbcTemplate.update(sql, dto.getBmId(), dto.getLoanId());
        }

        return getById(dto.getLoanId());
    }

    @Override
    @Transactional
    public Loan payEmi(EmiPaymentDto dto) {
        Loan l = getById(dto.getLoanId());
        if (l == null) throw new RuntimeException("Loan not found");
        if (!"Approved".equalsIgnoreCase(l.getStatus()) &&
            !"Ongoing".equalsIgnoreCase(l.getLoanStatus())) {
            throw new RuntimeException("Loan is not active for EMI payment");
        }

        double pay = dto.getAmount();
        if (pay <= 0) throw new RuntimeException("Invalid EMI amount");

        double remaining = l.getRemainingAmount() - pay;
        if (remaining < 0) remaining = 0;

        int paidEmis = l.getPaidEmis() + 1;
        LocalDate today = LocalDate.now();
        LocalDate next = today.plusMonths(1);

        String newStatus = l.getLoanStatus();
        String overallStatus = l.getStatus();

        if (remaining == 0) {
            overallStatus = "CLOSED";
        }

        String sql = "UPDATE loan SET remaining_amount=?, paid_emis=?, last_payment_date=?, " +
                "next_payment_date=?, loan_status=? WHERE loan_id=?";

        jdbcTemplate.update(sql,
                remaining,
                paidEmis,
                Date.valueOf(today),
                (remaining == 0 ? null : Date.valueOf(next)),
                overallStatus,
                dto.getLoanId());

        return getById(dto.getLoanId());
    }

    @Override
    public Loan getById(Integer loanId) {
        String sql = "SELECT * FROM loan WHERE loan_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, this::mapLoan, loanId);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public List<Loan> getByCustomer(Integer custId) {
        String sql = "SELECT * FROM loan WHERE cust_id = ? IF loan_status='ACTIVE'";
        return jdbcTemplate.query(sql, this::mapLoan, custId);
    }
    @Override
    public List<CreateLoanDto> getLoanStatusReport() {
        String sql = "SELECT loan_id, cust_id, loan_type, amount, interest_rate, tenure_months, " +
                     "loan_status, total_emis, paid_emis, remaining_amount, " +
                     "issue_date, next_payment_date, last_payment_date FROM loan ";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            CreateLoanDto dto = new CreateLoanDto();
            dto.setLoanId(rs.getInt("loan_id"));
            dto.setCustId(rs.getInt("cust_id"));
            dto.setLoanType(rs.getString("loan_type"));
            dto.setAmount(rs.getDouble("amount"));
            dto.setInterestRate(rs.getDouble("interest_rate"));
            dto.setTenureMonths(rs.getInt("tenure_months"));
            dto.setLoanStatus(rs.getString("loan_status"));
//            dto.setLoanProcessStatus(rs.getString("loan_process_status"));
            dto.setTotalEmis(rs.getInt("total_emis"));
            dto.setPaidEmis(rs.getInt("paid_emis"));
            dto.setRemainingAmount(rs.getDouble("remaining_amount"));
            dto.setIssueDate(rs.getDate("issue_date"));
            dto.setNextPaymentDate(rs.getDate("next_payment_date"));
            dto.setLastPaymentDate(rs.getDate("last_payment_date"));
            return dto;
        });
    }
    @Override
    public List<Loan> getAll() {
        String sql = "SELECT * FROM loan";
        return jdbcTemplate.query(sql, this::mapLoan);
    }

    private Loan mapLoan(ResultSet rs, int rowNum) throws SQLException {
        Loan l = new Loan();
        l.setLoanId(rs.getInt("loan_id"));
        l.setCustId(rs.getInt("cust_id"));
        l.setBmId(rs.getInt("bm_id"));
        l.setAmount(rs.getDouble("amount"));
        l.setStatus(rs.getString("status"));
        l.setIssueDate(rs.getDate("issue_date"));
        l.setInterestRate(rs.getDouble("interest_rate"));
        l.setTenureMonths(rs.getInt("tenure_months"));
        l.setLoanType(rs.getString("loan_type"));
        l.setEmiAmount(rs.getDouble("emi_amount"));
        l.setTotalEmis(rs.getInt("total_emis"));
        l.setPaidEmis(rs.getInt("paid_emis"));
        l.setNextPaymentDate(rs.getDate("next_payment_date"));
        l.setLastPaymentDate(rs.getDate("last_payment_date"));
        l.setRemainingAmount(rs.getDouble("remaining_amount"));
        l.setEmiFrequency(rs.getString("emi_frequency"));
        l.setLoanStatus(rs.getString("loan_status"));
        return l;
    }
}
