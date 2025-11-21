package com.altiusacademy.service;

import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherSubjectService {
    
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskSubmissionRepository taskSubmissionRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final SubjectRepository subjectRepository;
    
    public TeacherSubjectService(
            UserRepository userRepository,
            TaskRepository taskRepository,
            TaskSubmissionRepository taskSubmissionRepository,
            TeacherSubjectRepository teacherSubjectRepository,
            SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.taskSubmissionRepository = taskSubmissionRepository;
        this.teacherSubjectRepository = teacherSubjectRepository;
        this.subjectRepository = subjectRepository;
    }
    
    public Map<String, Object> getTeacherSubjectsWithStats(String email) {
        // Obtener el profesor
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        
        // ✅ USAR teacher_subjects en lugar de tasks
        List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherId(teacher.getId());
        
        List<Map<String, Object>> subjects = new ArrayList<>();
        
        for (TeacherSubject ts : teacherSubjects) {
            if (!ts.getIsActive()) continue;
            
            // Obtener la materia completa
            Optional<Subject> subjectOpt = subjectRepository.findById(ts.getSubjectId());
            if (!subjectOpt.isPresent()) continue;
            
            Subject subject = subjectOpt.get();
            String grade = ts.getGrade();
            
            // Contar estudiantes del grado
            long totalStudents = userRepository.countBySchoolGradeGradeName(grade);
            
            // Obtener tareas de esta materia y grado
            List<Task> subjectTasks = taskRepository.findByTeacherId(teacher.getId()).stream()
                    .filter(task -> task.getSubject() != null && 
                                   task.getSubject().getId().equals(ts.getSubjectId()) &&
                                   grade.equals(task.getGrade()))
                    .collect(Collectors.toList());
            
            int totalTasks = subjectTasks.size();
            
            // Obtener todas las entregas de estas tareas
            List<Long> taskIds = subjectTasks.stream()
                    .map(Task::getId)
                    .collect(Collectors.toList());
            
            List<TaskSubmission> submissions = taskIds.isEmpty() ? 
                    new ArrayList<>() : 
                    taskSubmissionRepository.findByTaskIdIn(taskIds);
            
            // Contar entregas calificadas (completadas)
            long completedTasks = submissions.stream()
                    .filter(s -> s.getStatus() == TaskSubmission.SubmissionStatus.GRADED)
                    .count();
            
            // Calcular tareas pendientes: (total tareas × estudiantes) - entregas realizadas
            long totalExpectedSubmissions = (long) totalTasks * totalStudents;
            long pendingTasks = totalExpectedSubmissions - submissions.size();
            
            // Calcular promedio de calificaciones solo de las calificadas
            double averageGrade = submissions.stream()
                    .filter(s -> s.getScore() != null && s.getStatus() == TaskSubmission.SubmissionStatus.GRADED)
                    .mapToDouble(TaskSubmission::getScore)
                    .average()
                    .orElse(0.0);
            
            // Calcular progreso: (entregas calificadas / total esperado) × 100
            int progress = totalExpectedSubmissions > 0
                    ? (int) ((completedTasks * 100.0) / totalExpectedSubmissions)
                    : 0;
            
            // Colores por materia
            String color = subject.getColor() != null ? subject.getColor() : getSubjectColor(subject.getName());
            
            Map<String, Object> subjectData = new HashMap<>();
            subjectData.put("id", subject.getId());
            subjectData.put("name", subject.getName());
            subjectData.put("description", subject.getDescription());
            subjectData.put("grade", grade);
            subjectData.put("color", color);
            subjectData.put("totalStudents", totalStudents);
            subjectData.put("totalTasks", totalTasks);
            subjectData.put("completedTasks", completedTasks);
            subjectData.put("pendingTasks", pendingTasks);
            subjectData.put("progress", progress);
            subjectData.put("averageGrade", Math.round(averageGrade * 100.0) / 100.0);
            
            subjects.add(subjectData);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("subjects", subjects);
        response.put("totalSubjects", subjects.size());
        
        return response;
    }
    
    private String getSubjectColor(String subjectName) {
        Map<String, String> colors = Map.of(
            "Matemáticas", "#3B82F6",
            "Ciencias Naturales", "#10B981",
            "Español", "#F59E0B",
            "Inglés", "#8B5CF6",
            "Historia", "#EF4444",
            "Geografía", "#06B6D4"
        );
        return colors.getOrDefault(subjectName, "#6B7280");
    }
}
