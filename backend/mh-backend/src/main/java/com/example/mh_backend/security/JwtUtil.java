package com.example.mh_backend.security;



import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

    // MUST be minimum 32 chars for HS256
    private static final String SECRET = "ThisIsA32CharLongSecretKeyForJwt!!";
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Token expiry (10 minutes)
    private static final long EXPIRATION_MS = 10 * 60 * 1000;

    // Generate JWT
    public static String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate and return all claims
    private static Claims getClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract username
    public static String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Extract role
    public static String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // Check expiration
    public static boolean isExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
}
