package com.example.mh_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mh_backend.entity.Appointment;
import com.example.mh_backend.repository.AppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository repo;

    public Appointment book(Appointment appointment) {
        return repo.save(appointment);
    }

    public List<Appointment> getUserAppointments(Long userId) {
        return repo.findByUserIdOrderByAppointmentDateAsc(userId);
    }
    public void cancel(Long appointmentId) {
        repo.deleteById(appointmentId);
    }

}
