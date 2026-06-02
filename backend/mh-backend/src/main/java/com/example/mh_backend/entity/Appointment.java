
package com.example.mh_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user who booked appointment
    private Long userId;

    // doctor's display name
    private String doctorName;

    // doctor's login username (IMPORTANT)
    private String doctorUsername;

    private String specialization;

    private LocalDate appointmentDate;

    private String timeSlot;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    private String meetingLink;

    private LocalDateTime createdAt = LocalDateTime.now();
}

