package com.altiusacademy.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;
    
    @Column(name = "attendance_date", nullable = false)
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AttendanceStatus status;
    
    @Column(name = "comments", length = 500)
    private String comments;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructores
    public Attendance() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Attendance(User student, User teacher, LocalDate date, AttendanceStatus status) {
        this();
        this.student = student;
        this.teacher = teacher;
        this.date = date;
        this.status = status;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getStudent() {
        return student;
    }
    
    public void setStudent(User student) {
        this.student = student;
    }
    
    public User getTeacher() {
        return teacher;
    }
    
    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(AttendanceStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Enum para el estado de asistencia
    public enum AttendanceStatus {
        PRESENT("Presente"),
        ABSENT("Ausente"),
        LATE("Tardanza"),
        EXCUSED("Justificado");
        
        private final String displayName;
        
        AttendanceStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    @Override
    public String toString() {
        return "Attendance{" +
                "id=" + id +
                ", student=" + (student != null ? student.getEmail() : "null") +
                ", teacher=" + (teacher != null ? teacher.getEmail() : "null") +
                ", date=" + date +
                ", status=" + status +
                ", comments='" + comments + '\'' +
                '}';
    }
}