package com.example.mh_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mh_backend.entity.Appointment;

public interface AppointmentRepository
extends JpaRepository<Appointment, Long> {

List<Appointment> findByUserIdOrderByAppointmentDateAsc(Long userId);
}
