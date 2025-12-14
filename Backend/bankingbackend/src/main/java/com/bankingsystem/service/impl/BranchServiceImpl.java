package com.bankingsystem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.bankingsystem.service.BranchService;

@Service
public class BranchServiceImpl implements BranchService{

	private final JdbcTemplate jdbcTemplate;

    public BranchServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
	
	@Override
	public List<Map<String, Object>> getBranchPerformanceReport() {
	    String sql = """
	        SELECT 
	            b.branch_name AS branchName,
	            COUNT(DISTINCT a.acc_no) AS accountOpenings,
	            COUNT(t.trans_id) AS transactionCount,
	            SUM(CASE WHEN t.trans_type = 'Credit' THEN t.amount ELSE 0 END) AS totalRevenue
	        FROM branch b
	        LEFT JOIN customer c ON b.branch_id = c.branch_id
	        LEFT JOIN account a ON c.cust_id = a.cust_id
	        LEFT JOIN transaction t ON a.acc_no = t.acc_no
	        GROUP BY b.branch_id, b.branch_name
	        ORDER BY b.branch_name
	    """;

	    return jdbcTemplate.query(sql, (rs, rowNum) -> {
	        Map<String, Object> map = new HashMap<>();
	        map.put("branchName", rs.getString("branchName"));
	        map.put("accountOpenings", rs.getInt("accountOpenings"));
	        map.put("transactionCount", rs.getInt("transactionCount"));
	        map.put("totalRevenue", rs.getDouble("totalRevenue"));
	        return map;
	    });
	}
}
