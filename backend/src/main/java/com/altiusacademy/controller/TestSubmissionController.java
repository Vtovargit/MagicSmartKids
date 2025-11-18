package com.altiusacademy.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Controlador de prueba para crear entregas de ejemplo
 * SOLO PARA DESARROLLO - Eliminar en producción
 */
@RestController
@RequestMapping("/api/test/submissions")
@CrossOrigin(origins = "*")
public class TestSubmissionController {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private TaskSubmissionRepository taskSubmissionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    /**
     * Listar archivos disponibles en la carpeta uploads
     */
    @GetMapping("/available-files")
    public ResponseEntity<?> listAvailableFiles() {
        try {
            File uploadsFolder = new File(uploadDir);
            List<String> files = new ArrayList<>();
            
            if (uploadsFolder.exists() && uploadsFolder.isDirectory()) {
                listFilesRecursively(uploadsFolder, "", files);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "uploadDir", uploadDir,
                "files", files,
                "totalFiles", files.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    private void listFilesRecursively(File folder, String relativePath, List<String> fileList) {
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    String newRelativePath = relativePath.isEmpty() 
                        ? file.getName() 
                        : relativePath + "/" + file.getName();
                    listFilesRecursively(file, newRelativePath, fileList);
                } else {
                    String filePath = relativePath.isEmpty() 
                        ? file.getName() 
                        : relativePath + "/" + file.getName();
                    fileList.add(filePath);
                }
            }
        }
    }
    
    /**
     * Crear entrega de prueba con archivos de la carpeta uploads
     */
    @PostMapping("/create-test-submission")
    public ResponseEntity<?> createTestSubmission(@RequestBody Map<String, Object> request) {
        try {
            Long taskId = Long.valueOf(request.get("taskId").toString());
            Long studentId = Long.valueOf(request.get("studentId").toString());
            
            @SuppressWarnings("unchecked")
            List<String> files = (List<String>) request.get("files");
            String comments = (String) request.get("comments");
            
            // Verificar que la tarea existe
            Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
            
            // Verificar que el estudiante existe
            User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            // Verificar si ya existe una entrega
            if (taskSubmissionRepository.existsByTaskIdAndStudentId(taskId, studentId)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Ya existe una entrega para este estudiante en esta tarea"
                ));
            }
            
            // Crear la entrega
            TaskSubmission submission = new TaskSubmission();
            submission.setTask(task);
            submission.setStudent(student);
            submission.setSubmissionText(comments);
            submission.setStatus(TaskSubmission.SubmissionStatus.SUBMITTED);
            
            // Guardar archivos
            if (files != null && !files.isEmpty()) {
                submission.setSubmissionFileUrl(files.get(0)); // Primer archivo
                submission.setSubmissionFiles(objectMapper.writeValueAsString(files));
            }
            
            TaskSubmission saved = taskSubmissionRepository.save(submission);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Entrega de prueba creada exitosamente",
                "submissionId", saved.getId(),
                "studentName", student.getFullName(),
                "taskTitle", task.getTitle(),
                "filesCount", files != null ? files.size() : 0
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Crear múltiples entregas de prueba automáticamente
     */
    @PostMapping("/create-multiple-test-submissions")
    public ResponseEntity<?> createMultipleTestSubmissions(@RequestBody Map<String, Object> request) {
        try {
            Long taskId = Long.valueOf(request.get("taskId").toString());
            
            // Obtener la tarea
            Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
            
            // Obtener estudiantes del mismo grado
            List<User> students = userRepository.findAll().stream()
                .filter(u -> "STUDENT".equals(u.getRole().name()))
                .filter(u -> u.getSchoolGrade() != null)
                .filter(u -> task.getGrade().equals(u.getSchoolGrade().getGradeName()))
                .limit(5) // Máximo 5 entregas de prueba
                .toList();
            
            if (students.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "No se encontraron estudiantes del grado " + task.getGrade()
                ));
            }
            
            // Obtener archivos disponibles
            File uploadsFolder = new File(uploadDir);
            List<String> availableFiles = new ArrayList<>();
            if (uploadsFolder.exists() && uploadsFolder.isDirectory()) {
                listFilesRecursively(uploadsFolder, "", availableFiles);
            }
            
            if (availableFiles.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "No hay archivos disponibles en la carpeta uploads"
                ));
            }
            
            List<Map<String, Object>> createdSubmissions = new ArrayList<>();
            
            for (int i = 0; i < students.size(); i++) {
                User student = students.get(i);
                
                // Verificar si ya existe una entrega
                if (taskSubmissionRepository.existsByTaskIdAndStudentId(taskId, student.getId())) {
                    continue;
                }
                
                // Seleccionar 1-3 archivos aleatorios
                int fileCount = 1 + (int)(Math.random() * 3);
                List<String> selectedFiles = new ArrayList<>();
                for (int j = 0; j < Math.min(fileCount, availableFiles.size()); j++) {
                    int randomIndex = (int)(Math.random() * availableFiles.size());
                    selectedFiles.add(availableFiles.get(randomIndex));
                }
                
                // Crear la entrega
                TaskSubmission submission = new TaskSubmission();
                submission.setTask(task);
                submission.setStudent(student);
                submission.setSubmissionText("Entrega de prueba - " + student.getFullName());
                submission.setStatus(TaskSubmission.SubmissionStatus.SUBMITTED);
                
                if (!selectedFiles.isEmpty()) {
                    submission.setSubmissionFileUrl(selectedFiles.get(0));
                    submission.setSubmissionFiles(objectMapper.writeValueAsString(selectedFiles));
                }
                
                TaskSubmission saved = taskSubmissionRepository.save(submission);
                
                createdSubmissions.add(Map.of(
                    "submissionId", saved.getId(),
                    "studentName", student.getFullName(),
                    "filesCount", selectedFiles.size()
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Entregas de prueba creadas exitosamente",
                "taskTitle", task.getTitle(),
                "totalSubmissions", createdSubmissions.size(),
                "submissions", createdSubmissions
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Agregar archivos a una entrega específica
     */
    @PostMapping("/update-submission-files")
    public ResponseEntity<?> updateSubmissionFiles(@RequestBody Map<String, Object> request) {
        try {
            Long submissionId = Long.valueOf(request.get("submissionId").toString());
            
            @SuppressWarnings("unchecked")
            List<String> files = (List<String>) request.get("files");
            
            TaskSubmission submission = taskSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Entrega no encontrada"));
            
            if (files != null && !files.isEmpty()) {
                submission.setSubmissionFileUrl(files.get(0));
                submission.setSubmissionFiles(objectMapper.writeValueAsString(files));
                taskSubmissionRepository.save(submission);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Archivos agregados exitosamente",
                "submissionId", submissionId,
                "filesCount", files != null ? files.size() : 0
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Crear entregas para TODAS las tareas sin entregas
     */
    @PostMapping("/create-submissions-for-all-tasks")
    public ResponseEntity<?> createSubmissionsForAllTasks() {
        try {
            // Obtener archivos disponibles
            File uploadsFolder = new File(uploadDir);
            List<String> availableFiles = new ArrayList<>();
            if (uploadsFolder.exists() && uploadsFolder.isDirectory()) {
                listFilesRecursively(uploadsFolder, "", availableFiles);
            }
            
            if (availableFiles.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "No hay archivos disponibles en la carpeta uploads"
                ));
            }
            
            // Obtener todas las tareas
            List<Task> allTasks = taskRepository.findAll();
            
            int createdCount = 0;
            List<String> tasksProcessed = new ArrayList<>();
            
            for (Task task : allTasks) {
                // Verificar si la tarea ya tiene entregas
                long existingSubmissions = taskSubmissionRepository.countSubmissionsByTaskId(task.getId());
                
                if (existingSubmissions > 0) {
                    continue; // Ya tiene entregas, saltar
                }
                
                // Buscar estudiantes del mismo grado
                List<User> students = userRepository.findAll().stream()
                    .filter(u -> "STUDENT".equals(u.getRole().name()))
                    .filter(u -> u.getSchoolGrade() != null)
                    .filter(u -> task.getGrade().equals(u.getSchoolGrade().getGradeName()))
                    .limit(3) // Crear 3 entregas por tarea
                    .toList();
                
                if (students.isEmpty()) {
                    continue; // No hay estudiantes del grado
                }
                
                // Crear entregas para esta tarea
                for (User student : students) {
                    // Seleccionar 1-2 archivos aleatorios
                    int fileCount = 1 + (int)(Math.random() * 2);
                    List<String> selectedFiles = new ArrayList<>();
                    
                    for (int i = 0; i < Math.min(fileCount, availableFiles.size()); i++) {
                        int randomIndex = (int)(Math.random() * availableFiles.size());
                        String file = availableFiles.get(randomIndex);
                        if (!selectedFiles.contains(file)) {
                            selectedFiles.add(file);
                        }
                    }
                    
                    // Crear la entrega
                    TaskSubmission submission = new TaskSubmission();
                    submission.setTask(task);
                    submission.setStudent(student);
                    submission.setSubmissionText("Entrega de prueba - " + student.getFullName());
                    submission.setStatus(TaskSubmission.SubmissionStatus.SUBMITTED);
                    
                    if (!selectedFiles.isEmpty()) {
                        submission.setSubmissionFileUrl(selectedFiles.get(0));
                        submission.setSubmissionFiles(objectMapper.writeValueAsString(selectedFiles));
                    }
                    
                    taskSubmissionRepository.save(submission);
                    createdCount++;
                }
                
                tasksProcessed.add(task.getTitle() + " (" + task.getGrade() + ")");
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Entregas creadas exitosamente",
                "totalSubmissionsCreated", createdCount,
                "totalTasksProcessed", tasksProcessed.size(),
                "tasksProcessed", tasksProcessed.subList(0, Math.min(10, tasksProcessed.size())),
                "availableFiles", availableFiles.size()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Agregar archivos aleatorios a TODAS las entregas sin archivos
     */
    @PostMapping("/add-files-to-all-submissions")
    public ResponseEntity<?> addFilesToAllSubmissions() {
        try {
            // Obtener archivos disponibles
            File uploadsFolder = new File(uploadDir);
            List<String> availableFiles = new ArrayList<>();
            if (uploadsFolder.exists() && uploadsFolder.isDirectory()) {
                listFilesRecursively(uploadsFolder, "", availableFiles);
            }
            
            if (availableFiles.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "No hay archivos disponibles en la carpeta uploads"
                ));
            }
            
            // Obtener todas las entregas sin archivos
            List<TaskSubmission> submissions = taskSubmissionRepository.findAll().stream()
                .filter(s -> s.getSubmissionFiles() == null || s.getSubmissionFiles().isEmpty())
                .toList();
            
            if (submissions.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "No hay entregas sin archivos",
                    "totalSubmissions", 0
                ));
            }
            
            int updatedCount = 0;
            
            for (TaskSubmission submission : submissions) {
                // Seleccionar 1-3 archivos aleatorios
                int fileCount = 1 + (int)(Math.random() * 3);
                List<String> selectedFiles = new ArrayList<>();
                
                for (int i = 0; i < Math.min(fileCount, availableFiles.size()); i++) {
                    int randomIndex = (int)(Math.random() * availableFiles.size());
                    String file = availableFiles.get(randomIndex);
                    if (!selectedFiles.contains(file)) {
                        selectedFiles.add(file);
                    }
                }
                
                if (!selectedFiles.isEmpty()) {
                    submission.setSubmissionFileUrl(selectedFiles.get(0));
                    submission.setSubmissionFiles(objectMapper.writeValueAsString(selectedFiles));
                    taskSubmissionRepository.save(submission);
                    updatedCount++;
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Archivos agregados exitosamente a las entregas",
                "totalSubmissions", submissions.size(),
                "updatedSubmissions", updatedCount,
                "availableFiles", availableFiles.size()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
