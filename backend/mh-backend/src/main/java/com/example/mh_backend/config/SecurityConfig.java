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
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // 🔴 THESE TWO ARE REQUIRED
                .requestMatchers("/api/journal/**").authenticated()
                .requestMatchers("/api/appointments/**").authenticated()

                .anyRequest().authenticated()
            )

            // 🔑 JWT FILTER
            .addFilterBefore(
                jwtAuthFilter(),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
