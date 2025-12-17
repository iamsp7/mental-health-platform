package com.example.mh_backend.service;



import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mh_backend.dto.AuthResponse;
import com.example.mh_backend.dto.LoginRequest;
import com.example.mh_backend.dto.RegisterRequest;
import com.example.mh_backend.entity.Role;
import com.example.mh_backend.entity.User;
import com.example.mh_backend.repository.UserRepository;
import com.example.mh_backend.security.JwtUtil;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest req) {
        if (req.getUsername() == null || req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("Missing fields");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Role role = Role.USER;
        if (req.getRole() != null && req.getRole().equalsIgnoreCase("ADMIN")) {
            role = Role.ADMIN;
        }

        String hashed = passwordEncoder.encode(req.getPassword());
        User user = new User(req.getUsername(), req.getEmail(), hashed, role);
        userRepository.save(user);
        return "User registered";
    }

    public AuthResponse login(LoginRequest req) {
        Optional<User> maybe = userRepository.findByUsername(req.getUsername());
        if (maybe.isEmpty()) {
            maybe = userRepository.findByEmail(req.getUsername());
        }
        if (maybe.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = maybe.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Use your JwtUtil to generate token. JwtUtil.generateToken(username, role)
        String token = JwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}
