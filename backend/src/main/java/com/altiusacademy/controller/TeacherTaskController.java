package com.altiusacademy.controller;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.TeacherTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/tasks")
@CrossOrigin(origins = "*")
public class TeacherTaskController {
    
    private final TeacherTaskService teacherTaskService;
    
    @Autowired
    private UserRepository userRepository;
    
    public TeacherTaskController(TeacherTaskService teacherTaskService) {
        this.teacherTaskService = teacherTaskService;
    }
    
    @PostMapping
    public ResponseEntity<List<TaskResponse>> createTask(
            @RequestBody TaskCreateRequest request,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.createTask(teacherId, request);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.getTeacherTasks(teacherId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        TaskResponse task = teacherTaskService.getTaskById(taskId, teacherId);
        return ResponseEntity.ok(task);
    }
    
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskCreateRequest request,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        TaskResponse task = teacherTaskService.updateTask(taskId, teacherId, request);
        return ResponseEntity.ok(task);
    }
    
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        teacherTaskService.deleteTask(taskId, teacherId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{taskId}/grade")
    public ResponseEntity<TaskResponse> gradeTask(
            @PathVariable Long taskId,
            @RequestBody TaskGradeRequest request,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        TaskResponse task = teacherTaskService.gradeTask(taskId, teacherId, request);
        return ResponseEntity.ok(task);
    }
    
    @GetMapping("/submitted")
    public ResponseEntity<List<TaskResponse>> getSubmittedTasks(Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.getSubmittedTasks(teacherId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<TaskResponse>> getTasksBySubject(
            @PathVariable Long subjectId,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.getTasksBySubject(teacherId, subjectId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<String>> getAvailableGrades(Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<String> grades = teacherTaskService.getTeacherGrades(teacherId);
        return ResponseEntity.ok(grades);
    }
    
    private Long extractTeacherId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
            
            // Buscar usuario por email
            String email = userDetails.getUsername();
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user != null) {
                return user.getId();
            }
        }
        
        // Fallback: usar ID 16 (vtp@gmail.com) para pruebas
        return 16L;
    }
}
