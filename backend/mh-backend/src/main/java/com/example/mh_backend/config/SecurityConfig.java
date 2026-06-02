package com.example.mh_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))

            .authorizeHttpRequests(auth -> auth

            	    // Public endpoints
            	    .requestMatchers("/api/auth/**").permitAll()
            	    .requestMatchers("/h2-console/**").permitAll()

            	    // Doctor endpoints
            	    .requestMatchers("/api/doctor/**").hasRole("DOCTOR")

            	    // User endpoints
            	    .requestMatchers("/api/appointments/**").hasAnyRole("USER","ADMIN")

            	    // Journal can be used by both
            	    .requestMatchers("/api/journal/**").hasAnyRole("USER", "DOCTOR","ADMIN")

            	    // everything else
            	    .anyRequest().authenticated()
            	)

            .addFilterBefore(
                jwtAuthFilter(),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}