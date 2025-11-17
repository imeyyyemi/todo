package com.example.todo.controller;

import com.example.todo.model.User;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("Register called with user: " + (user != null ? user.getUsername() : "null"));

            // Validate user object
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Request body is required"));
            }

            // Validate username
            String username = user.getUsername();
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username is required"));
            }

            // Validate password
            String password = user.getPassword();
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
            }

            // Check if username already exists
            Optional<User> existing = userRepo.findByUsername(username);
            if (existing.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username already exists"));
            }

            // Create and save user
            user.setPassword(encoder.encode(password));
            User savedUser = userRepo.save(user);

            System.out.println("User registered successfully: " + savedUser.getId());

            return ResponseEntity.ok(Map.of(
                "message", "Registered successfully",
                "userId", savedUser.getId()
            ));
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            System.out.println("Login called with user: " + (user != null ? user.getUsername() : "null"));

            // Validate user object
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Request body is required"));
            }

            // Validate username
            String username = user.getUsername();
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username is required"));
            }

            // Validate password
            String password = user.getPassword();
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
            }

            // Find user and check password
            Optional<User> dbUser = userRepo.findByUsername(username);
            if (dbUser.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid credentials"));
            }

            if (!encoder.matches(password, dbUser.get().getPassword())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid credentials"));
            }

            System.out.println("User logged in successfully: " + dbUser.get().getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", "jwt-token-" + username);
            response.put("message", "Login successful");
            response.put("userId", dbUser.get().getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }
}

