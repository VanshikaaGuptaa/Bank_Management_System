package com.bankingsystem.security;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
 
import java.util.Arrays;
 
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
 
    @Autowired
    private JwtTokenProvider tokenProvider;
 
    /** -------- CORS GLOBAL FIX (WORKS 100%) -------- */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // react allowed
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
 
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
 
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenProvider);
    }
 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
 
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable()) // CORS handled by Bean above
 
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/public/**").permitAll()// login register open
                .requestMatchers("/api/rm/**").permitAll()
                .requestMatchers("/api/bank-managers/**").permitAll()
                .requestMatchers("/api/bank-employees/**").permitAll()
                .requestMatchers("/api/customers/**").permitAll()
                .requestMatchers("/api/loans/**").permitAll()
                .requestMatchers("/api/accounts/**").permitAll()
                .requestMatchers("/api/branches/**").permitAll()
                .requestMatchers("/api/transactions/**").permitAll()
                .requestMatchers("/api/subsequent/**").permitAll()
                .anyRequest().authenticated()
            )
 
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
 
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
 
        return http.build();
    }
 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
 
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}