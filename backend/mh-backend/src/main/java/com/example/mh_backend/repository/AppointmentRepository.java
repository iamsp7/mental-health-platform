
package com.example.mh_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mh_backend.entity.Appointment;
import com.example.mh_backend.entity.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Patient appointments
    List<Appointment> findByUserIdOrderByAppointmentDateAsc(Long userId);

    // Doctor dashboard appointments (IMPORTANT)
    List<Appointment> findByDoctorUsernameOrderByAppointmentDateAsc(String doctorUsername);

    // Optional status filter
    List<Appointment> findByDoctorUsernameAndStatus(String doctorUsername, AppointmentStatus status);
}

