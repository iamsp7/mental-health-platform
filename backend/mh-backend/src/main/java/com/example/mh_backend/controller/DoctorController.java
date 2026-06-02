package com.example.mh_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.mh_backend.entity.Appointment;
import com.example.mh_backend.entity.AppointmentStatus;
import com.example.mh_backend.repository.AppointmentRepository;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin
public class DoctorController {

    @Autowired
    private AppointmentRepository repo;

    @GetMapping("/appointments")
    public List<Appointment> getDoctorAppointments(Authentication authentication) {

        String doctorName = authentication.getName();

        return repo.findByDoctorUsernameOrderByAppointmentDateAsc(doctorName);
    }

    @PutMapping("/appointments/{id}/accept")
    public Appointment accept(@PathVariable Long id) {

        Appointment a = repo.findById(id).orElseThrow();

        a.setStatus(AppointmentStatus.ACCEPTED);
        a.setMeetingLink("https://meet.jit.si/mental-health-" + id);

        return repo.save(a);
    }

    @PutMapping("/appointments/{id}/reject")
    public Appointment reject(@PathVariable Long id) {

        Appointment a = repo.findById(id).orElseThrow();

        a.setStatus(AppointmentStatus.REJECTED);

        return repo.save(a);
    }
}