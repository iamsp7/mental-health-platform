package com.example.mh_backend.controller;

import java.nio.file.attribute.UserPrincipal;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mh_backend.entity.User;
import com.example.mh_backend.repository.JournalRepository;
import com.example.mh_backend.repository.UserRepository;
import com.example.mh_backend.service.JournalService;
@RestController
@RequestMapping("/api/journal")
@CrossOrigin
public class JournalController {

    @Autowired
    private JournalService service;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JournalRepository journalRepository;


    @PostMapping
    public ResponseEntity<?> saveJournal(
            @RequestBody Map<String, Object> body,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String content = (String) body.get("content");
        String label = (String) body.get("label");

        Float suicidalScore = body.get("suicidalScore") != null
                ? Float.valueOf(body.get("suicidalScore").toString())
                : null;

        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content required");
        }

        return ResponseEntity.ok(
            service.save(user.getId(), content, label, suicidalScore)
        );
    }
    @GetMapping
    public ResponseEntity<?> getMyJournals(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(service.getByUser(user.getId()));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        journalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
