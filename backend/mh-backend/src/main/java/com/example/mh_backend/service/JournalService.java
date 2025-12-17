package com.example.mh_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mh_backend.entity.JournalEntry;
import com.example.mh_backend.repository.JournalRepository;

@Service
public class JournalService {

    @Autowired
    private JournalRepository repo;

    public JournalEntry save(
            Long userId,
            String content,
            String label,
            Float suicidalScore
    ) {
        JournalEntry entry = new JournalEntry();
        entry.setUserId(userId);
        entry.setContent(content);
        entry.setLabel(label);
        entry.setSuicidalScore(suicidalScore);
        return repo.save(entry);
    }


    public List<JournalEntry> getByUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
