package com.altiusacademy.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.GradeTaskDto;
import com.altiusacademy.dto.StudentDto;
import com.altiusacademy.dto.TeacherDashboardStatsDto;
import com.altiusacademy.dto.TeacherTaskDto;
import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.TaskTemplate;
import com.altiusacademy.model.entity.TeacherSubject;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.TeacherSubjectRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*")
public class TeacherController {
    
    private static final Logger log = LoggerFactory.getLogger(TeacherController.class);
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private TeacherSubjectRepository teacherSubjectRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Método helper para obtener el usuario autenticado desde el Authentication
     */
    private User getUserFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<TeacherDashboardStatsDto> getDashboardStats(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for dashboard stats");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting dashboard stats for teacher: {} (ID: {})", user.getFullName(), teacherId);
            TeacherDashboardStatsDto stats = teacherService.getDashboardStats(teacherId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting teacher dashboard stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<?> getTeacherSubjects(org.springframework.security.core.Authentication authentication) {
        try {
            // DEBUG: Log para ver si el usuario llega
            log.info("=== INICIO getTeacherSubjects ===");
            log.info("Authentication object: {}", authentication);
            log.info("Authentication principal: {}", authentication != null ? authentication.getPrincipal() : "NULL");
            
            // Obtener el ID del profesor autenticado
            if (authentication == null || authentication.getPrincipal() == null) {
                log.error("❌ No authenticated user found - authentication is NULL");
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Usuario no autenticado",
                    "subjects", List.of(),
                    "total", 0
                ));
            }
            
            // Obtener el email del usuario autenticado
            String email = authentication.getName();
            log.info("📧 Email from authentication: {}", email);
            
            // Cargar el usuario completo desde la base de datos
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                log.error("❌ User not found in database for email: {}", email);
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Usuario no encontrado",
                    "subjects", List.of(),
                    "total", 0
                ));
            }
            
            Long teacherId = user.getId();
            log.info("✅ Getting subjects for authenticated teacher: {} {} (ID: {}, Email: {})", 
                user.getFirstName(), user.getLastName(), teacherId, user.getEmail());
            
            // Obtener SOLO las materias asignadas al profesor autenticado
            // CAMBIO: Usar findByTeacherId en lugar de findByTeacherIdWithSubject para evitar problemas con JOIN FETCH
            List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherId(teacherId)
                .stream()
                .filter(ts -> ts.getIsActive() != null && ts.getIsActive())
                .collect(Collectors.toList());
            
            log.info("📊 Found {} active teacher_subjects records for teacher {}", teacherSubjects.size(), teacherId);
            
            // DEBUG: Mostrar los IDs de las asignaciones encontradas
            if (teacherSubjects.isEmpty()) {
                log.warn("⚠️ No teacher_subjects found for teacher ID: {}", teacherId);
                log.warn("⚠️ Checking all records for this teacher...");
                List<TeacherSubject> allRecords = teacherSubjectRepository.findByTeacherId(teacherId);
                log.warn("⚠️ Total records (including inactive): {}", allRecords.size());
                allRecords.forEach(ts -> log.warn("   - ID: {}, SubjectId: {}, Grade: {}, Active: {}", 
                    ts.getId(), ts.getSubjectId(), ts.getGrade(), ts.getIsActive()));
            } else {
                teacherSubjects.forEach(ts -> log.info("   ✓ TeacherSubject ID: {}, SubjectId: {}, Grade: {}", 
                    ts.getId(), ts.getSubjectId(), ts.getGrade()));
            }
            
            List<Map<String, Object>> subjects = teacherSubjects.stream()
                .map(ts -> {
                    try {
                        // CAMBIO: Cargar la materia manualmente usando el subjectId
                        Subject subject = subjectRepository.findById(ts.getSubjectId()).orElse(null);
                        
                        if (subject == null) {
                            log.warn("Subject not found for ID: {} (TeacherSubject ID: {})", ts.getSubjectId(), ts.getId());
                            return null;
                        }
                        
                        log.debug("Processing subject: {} - {} for grade: {}", subject.getId(), subject.getName(), ts.getGrade());
                        
                        Map<String, Object> subjectMap = new java.util.HashMap<>();
                        subjectMap.put("id", subject.getId());
                        subjectMap.put("name", subject.getName());
                        subjectMap.put("description", subject.getDescription());
                        subjectMap.put("grade", ts.getGrade());
                        subjectMap.put("color", subject.getColor() != null ? subject.getColor() : "#2E5BFF");
                        
                        // Contar estudiantes del grado
                        try {
                            long studentCount = teacherSubjectRepository.countStudentsByGrade(ts.getGrade());
                            subjectMap.put("totalStudents", (int) studentCount);
                        } catch (Exception e) {
                            log.warn("Error counting students for grade {}: {}", ts.getGrade(), e.getMessage());
                            subjectMap.put("totalStudents", 0);
                        }
                        
                        // Calcular progreso y estadísticas reales
                        try {
                            int totalTasks = teacherService.countTasksBySubjectAndGrade(subject.getId(), ts.getGrade());
                            int completedTasks = teacherService.countCompletedTasksBySubjectAndGrade(subject.getId(), ts.getGrade());
                            int pendingTasks = totalTasks - completedTasks;
                            double progress = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0;
                            double averageGrade = teacherService.getAverageGradeBySubjectAndGrade(subject.getId(), ts.getGrade());
                            
                            subjectMap.put("totalTasks", totalTasks);
                            subjectMap.put("completedTasks", completedTasks);
                            subjectMap.put("pendingTasks", pendingTasks);
                            subjectMap.put("progress", Math.round(progress));
                            subjectMap.put("averageGrade", Math.round(averageGrade * 10.0) / 10.0);
                        } catch (Exception e) {
                            log.warn("Error calculating stats for subject {}: {}", subject.getId(), e.getMessage());
                            subjectMap.put("totalTasks", 0);
                            subjectMap.put("completedTasks", 0);
                            subjectMap.put("pendingTasks", 0);
                            subjectMap.put("progress", 0);
                            subjectMap.put("averageGrade", 0.0);
                        }
                        
                        // TODO: Agregar próxima tarea si existe
                        subjectMap.put("nextTask", null);
                        
                        return subjectMap;
                    } catch (Exception e) {
                        log.error("Error processing TeacherSubject {}: {}", ts.getId(), e.getMessage(), e);
                        return null;
                    }
                })
                .filter(subjectMap -> subjectMap != null)
                .collect(Collectors.toList());
            
            log.info("Returning {} subjects for teacher {}", subjects.size(), teacherId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "subjects", subjects,
                "total", subjects.size()
            ));
            
        } catch (Exception e) {
            log.error("Error getting teacher subjects: {}", 
                e.getMessage(), 
                e);
            
            // Retornar respuesta vacía pero válida en caso de error
            return ResponseEntity.ok(Map.of(
                "success", true,
                "subjects", List.of(),
                "total", 0,
                "message", "No se encontraron materias asignadas"
            ));
        }
    }

    @PostMapping("/tasks/template")
    public ResponseEntity<TaskTemplate> createTask(@RequestBody TeacherTaskDto taskDto, Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for task creation");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Creating task for teacher: {} (ID: {})", user.getFullName(), teacherId);
            TaskTemplate task = teacherService.createTask(taskDto, teacherId);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            log.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/tasks/overview")
    public ResponseEntity<List<TeacherTaskDto>> getTeacherTasks(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for tasks overview");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting tasks for teacher: {} (ID: {})", user.getFullName(), teacherId);
            List<TeacherTaskDto> tasks = teacherService.getTeacherTasks(teacherId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            log.error("Error getting teacher tasks: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/subjects/{subjectId}/tasks")
    public ResponseEntity<?> getTasksBySubjectAndGrade(
            @PathVariable Long subjectId,
            @RequestParam String grade,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting tasks for subject {} and grade {} by teacher {}", subjectId, grade, teacherId);
            
            List<Map<String, Object>> tasks = teacherService.getTasksBySubjectAndGrade(teacherId, subjectId, grade);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            log.error("Error getting tasks by subject and grade: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @DeleteMapping("/subjects/tasks/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId, Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            teacherService.deleteTask(taskId, user.getId());
            return ResponseEntity.ok(Map.of("success", true, "message", "Tarea eliminada correctamente"));
        } catch (Exception e) {
            log.error("Error deleting task: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<?> updateSubmissionGrade(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> gradeData,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Double score = gradeData.get("score") != null ? 
                Double.parseDouble(gradeData.get("score").toString()) : null;
            String feedback = gradeData.get("feedback") != null ? 
                gradeData.get("feedback").toString() : null;
            
            teacherService.updateSubmissionGrade(submissionId, user.getId(), score, feedback);
            return ResponseEntity.ok(Map.of("success", true, "message", "Nota actualizada correctamente"));
        } catch (Exception e) {
            log.error("Error updating submission grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<GradeTaskDto>> getGradingTasks(
            @RequestParam Long subjectId,
            @RequestParam String grade,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for grading tasks");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting grading tasks for teacher: {} (ID: {})", user.getFullName(), teacherId);
            List<GradeTaskDto> gradingTasks = teacherService.getGradingTasks(teacherId, subjectId, grade);
            return ResponseEntity.ok(gradingTasks);
        } catch (Exception e) {
            log.error("Error getting grading tasks: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/tasks/{taskId}/grade")
    public ResponseEntity<Void> gradeTask(
            @PathVariable Long taskId,
            @RequestBody GradeTaskDto gradeDto,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for grading task");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Grading task {} by teacher: {} (ID: {})", taskId, user.getFullName(), teacherId);
            teacherService.gradeTask(taskId, gradeDto, teacherId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error grading task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getStudentsByGrade(
            @RequestParam String grade,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for students list");
                return ResponseEntity.status(401).build();
            }
            
            log.info("Getting students for grade {} by teacher: {} (ID: {})", grade, user.getFullName(), user.getId());
            List<StudentDto> students = teacherService.getStudentsByGrade(grade);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            log.error("Error getting students by grade: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Endpoint temporal para inicializar materias de prueba para el profesor autenticado
     * SOLO PARA DESARROLLO - Eliminar en producción
     */
    @PostMapping("/init-test-subjects")
    public ResponseEntity<?> initTestSubjects(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            Long teacherId = user.getId();
            log.info("Initializing test subjects for teacher: {} (ID: {})", user.getFullName(), teacherId);
            
            // Verificar si ya tiene materias asignadas
            List<TeacherSubject> existing = teacherSubjectRepository.findByTeacherId(teacherId);
            if (!existing.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "message", "El profesor ya tiene " + existing.size() + " materias asignadas",
                    "subjects", existing.size()
                ));
            }
            
            // Obtener algunas materias de la base de datos
            List<Subject> allSubjects = subjectRepository.findAll();
            if (allSubjects.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "error", "No hay materias en la base de datos. Primero crea materias."
                ));
            }
            
            // Asignar las primeras 3-5 materias al profesor para el grado "5° A"
            int subjectsToAssign = Math.min(5, allSubjects.size());
            List<TeacherSubject> newAssignments = new java.util.ArrayList<>();
            
            for (int i = 0; i < subjectsToAssign; i++) {
                Subject subject = allSubjects.get(i);
                TeacherSubject ts = new TeacherSubject();
                ts.setTeacherId(teacherId);
                ts.setSubjectId(subject.getId());
                ts.setGrade("5° A");
                ts.setPeriod("2025-1");
                ts.setIsActive(true);
                
                newAssignments.add(teacherSubjectRepository.save(ts));
                log.info("Assigned subject {} to teacher {}", subject.getName(), teacherId);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Se asignaron " + newAssignments.size() + " materias al profesor",
                "subjects", newAssignments.size(),
                "grade", "5° A"
            ));
            
        } catch (Exception e) {
            log.error("Error initializing test subjects: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al inicializar materias: " + e.getMessage()
            ));
        }
    }
}