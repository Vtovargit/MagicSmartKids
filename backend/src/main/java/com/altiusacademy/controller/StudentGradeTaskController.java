package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.TaskSubmission;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.TaskRepository;
import com.altiusacademy.repository.mysql.TaskSubmissionRepository;
import com.altiusacademy.repository.mysql.UserRepository;

/**
 * Controlador para que los estudiantes vean las tareas de su grado
 */
@RestController
@RequestMapping("/api/student/grade-tasks")
public class StudentGradeTaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskSubmissionRepository taskSubmissionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Obtener todas las tareas del grado del estudiante autenticado
     */
    @GetMapping
    public ResponseEntity<?> getMyGradeTasks(Authentication authentication) {
        try {
            String email = authentication.getName();
            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (student.getSchoolGrade() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "El estudiante no tiene un grado asignado"
                ));
            }

            String gradeName = student.getSchoolGrade().getGradeName();
            
            // Obtener todas las tareas del grado
            List<Task> allTasks = taskRepository.findByGradeOrderByCreatedAtDesc(gradeName);
            
            // Filtrar solo las tareas del profesor vtp@gmail.com (para el piloto)
            List<Task> tasks = allTasks.stream()
                    .filter(task -> task.getTeacher() != null && 
                           "vtp@gmail.com".equals(task.getTeacher().getEmail()))
                    .collect(java.util.stream.Collectors.toList());

            // Agregar información de si el estudiante ya entregó cada tarea
            List<Map<String, Object>> tasksWithSubmission = tasks.stream().map(task -> {
                Map<String, Object> taskMap = new HashMap<>();
                taskMap.put("id", task.getId());
                taskMap.put("title", task.getTitle());
                taskMap.put("description", task.getDescription());
                taskMap.put("dueDate", task.getDueDate());
                taskMap.put("priority", task.getPriority());
                taskMap.put("status", task.getStatus());
                taskMap.put("taskType", task.getTaskType());
                taskMap.put("maxScore", task.getMaxScore());
                taskMap.put("maxGrade", task.getMaxGrade());
                taskMap.put("grade", task.getGrade());
                taskMap.put("createdAt", task.getCreatedAt());
                
                // Información del profesor
                if (task.getTeacher() != null) {
                    Map<String, Object> teacherMap = new HashMap<>();
                    teacherMap.put("id", task.getTeacher().getId());
                    teacherMap.put("firstName", task.getTeacher().getFirstName());
                    teacherMap.put("lastName", task.getTeacher().getLastName());
                    teacherMap.put("email", task.getTeacher().getEmail());
                    taskMap.put("teacher", teacherMap);
                }

                // Verificar si el estudiante ya entregó esta tarea
                TaskSubmission submission = taskSubmissionRepository
                        .findByTaskIdAndStudentId(task.getId(), student.getId())
                        .orElse(null);

                if (submission != null) {
                    taskMap.put("submitted", true);
                    taskMap.put("submissionId", submission.getId());
                    taskMap.put("submittedAt", submission.getSubmittedAt());
                    taskMap.put("submissionStatus", submission.getStatus());
                    taskMap.put("score", submission.getScore());
                    taskMap.put("feedback", submission.getFeedback());
                    taskMap.put("gradedAt", submission.getGradedAt());
                } else {
                    taskMap.put("submitted", false);
                }

                return taskMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                "tasks", tasksWithSubmission,
                "gradeName", gradeName,
                "totalTasks", tasks.size()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error al obtener las tareas: " + e.getMessage()
            ));
        }
    }

    /**
     * Obtener una tarea específica con detalles completos
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<?> getTaskDetails(@PathVariable Long taskId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

            // Verificar que la tarea sea del grado del estudiante
            if (student.getSchoolGrade() == null || 
                !task.getGrade().equals(student.getSchoolGrade().getGradeName())) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "No tienes permiso para ver esta tarea"
                ));
            }

            Map<String, Object> taskMap = new HashMap<>();
            taskMap.put("id", task.getId());
            taskMap.put("title", task.getTitle());
            taskMap.put("description", task.getDescription());
            taskMap.put("dueDate", task.getDueDate());
            taskMap.put("priority", task.getPriority());
            taskMap.put("status", task.getStatus());
            taskMap.put("taskType", task.getTaskType());
            taskMap.put("maxScore", task.getMaxScore());
            taskMap.put("maxGrade", task.getMaxGrade());
            taskMap.put("grade", task.getGrade());
            taskMap.put("createdAt", task.getCreatedAt());
            taskMap.put("activityConfig", task.getActivityConfig());
            taskMap.put("allowedFormats", task.getAllowedFormats());
            taskMap.put("maxFiles", task.getMaxFiles());
            taskMap.put("maxSizeMb", task.getMaxSizeMb());

            // Información del profesor
            if (task.getTeacher() != null) {
                Map<String, Object> teacherMap = new HashMap<>();
                teacherMap.put("id", task.getTeacher().getId());
                teacherMap.put("firstName", task.getTeacher().getFirstName());
                teacherMap.put("lastName", task.getTeacher().getLastName());
                teacherMap.put("email", task.getTeacher().getEmail());
                taskMap.put("teacher", teacherMap);
            }

            // Verificar si el estudiante ya entregó esta tarea
            TaskSubmission submission = taskSubmissionRepository
                    .findByTaskIdAndStudentId(task.getId(), student.getId())
                    .orElse(null);

            if (submission != null) {
                Map<String, Object> submissionMap = new HashMap<>();
                submissionMap.put("id", submission.getId());
                submissionMap.put("submissionText", submission.getSubmissionText());
                submissionMap.put("submissionFileUrl", submission.getSubmissionFileUrl());
                submissionMap.put("submittedAt", submission.getSubmittedAt());
                submissionMap.put("status", submission.getStatus());
                submissionMap.put("score", submission.getScore());
                submissionMap.put("feedback", submission.getFeedback());
                submissionMap.put("gradedAt", submission.getGradedAt());
                taskMap.put("submission", submissionMap);
            }

            return ResponseEntity.ok(taskMap);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error al obtener la tarea: " + e.getMessage()
            ));
        }
    }

    /**
     * Entregar una tarea
     */
    @PostMapping("/{taskId}/submit")
    public ResponseEntity<?> submitTask(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> submissionData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

            // Verificar que la tarea sea del grado del estudiante
            if (student.getSchoolGrade() == null || 
                !task.getGrade().equals(student.getSchoolGrade().getGradeName())) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "No tienes permiso para entregar esta tarea"
                ));
            }

            // Verificar si ya existe una entrega
            if (taskSubmissionRepository.existsByTaskIdAndStudentId(taskId, student.getId())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Ya has entregado esta tarea"
                ));
            }

            // Crear la entrega
            TaskSubmission submission = new TaskSubmission();
            submission.setTask(task);
            submission.setStudent(student);
            submission.setSubmissionText((String) submissionData.get("submissionText"));
            
            // Soportar tanto archivo único como múltiples archivos
            Object fileData = submissionData.get("submissionFileUrl");
            if (fileData != null) {
                if (fileData instanceof String) {
                    // Archivo único (compatibilidad con versión anterior)
                    submission.setSubmissionFileUrl((String) fileData);
                    submission.setSubmissionFiles("[\"" + fileData + "\"]");
                } else if (fileData instanceof java.util.List) {
                    // Múltiples archivos
                    @SuppressWarnings("unchecked")
                    java.util.List<String> files = (java.util.List<String>) fileData;
                    if (!files.isEmpty()) {
                        submission.setSubmissionFileUrl(files.get(0)); // Primer archivo para compatibilidad
                        try {
                            submission.setSubmissionFiles(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(files));
                        } catch (Exception e) {
                            submission.setSubmissionFiles("[]");
                        }
                    }
                }
            }
            
            // Soportar también el campo submissionFiles directamente
            Object filesData = submissionData.get("submissionFiles");
            if (filesData != null && filesData instanceof java.util.List) {
                @SuppressWarnings("unchecked")
                java.util.List<String> files = (java.util.List<String>) filesData;
                try {
                    submission.setSubmissionFiles(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(files));
                    if (!files.isEmpty() && submission.getSubmissionFileUrl() == null) {
                        submission.setSubmissionFileUrl(files.get(0));
                    }
                } catch (Exception e) {
                    submission.setSubmissionFiles("[]");
                }
            }
            
            submission.setStatus(TaskSubmission.SubmissionStatus.SUBMITTED);

            TaskSubmission savedSubmission = taskSubmissionRepository.save(submission);

            return ResponseEntity.ok(Map.of(
                "message", "Tarea entregada exitosamente",
                "submissionId", savedSubmission.getId(),
                "submittedAt", savedSubmission.getSubmittedAt()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error al entregar la tarea: " + e.getMessage()
            ));
        }
    }

    /**
     * Obtener estadísticas del estudiante
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStudentStats(Authentication authentication) {
        try {
            String email = authentication.getName();
            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (student.getSchoolGrade() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "El estudiante no tiene un grado asignado"
                ));
            }

            String gradeName = student.getSchoolGrade().getGradeName();
            List<Task> allTasks = taskRepository.findByGradeOrderByCreatedAtDesc(gradeName);
            List<TaskSubmission> submissions = taskSubmissionRepository.findByStudentId(student.getId());

            long totalTasks = allTasks.size();
            long submittedTasks = submissions.size();
            long gradedTasks = submissions.stream()
                    .filter(s -> s.getStatus() == TaskSubmission.SubmissionStatus.GRADED)
                    .count();

            double averageScore = submissions.stream()
                    .filter(s -> s.getScore() != null)
                    .mapToDouble(TaskSubmission::getScore)
                    .average()
                    .orElse(0.0);

            return ResponseEntity.ok(Map.of(
                "totalTasks", totalTasks,
                "submittedTasks", submittedTasks,
                "gradedTasks", gradedTasks,
                "pendingTasks", totalTasks - submittedTasks,
                "averageScore", Math.round(averageScore * 100.0) / 100.0,
                "gradeName", gradeName
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error al obtener estadísticas: " + e.getMessage()
            ));
        }
    }
}
