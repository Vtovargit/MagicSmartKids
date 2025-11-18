package com.altiusacademy.service;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherTaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TaskTemplateRepository taskTemplateRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final TaskSubmissionRepository taskSubmissionRepository;
    private final ObjectMapper objectMapper;
    
    public TeacherTaskService(
            TaskRepository taskRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository,
            TaskTemplateRepository taskTemplateRepository,
            TeacherSubjectRepository teacherSubjectRepository,
            TaskSubmissionRepository taskSubmissionRepository,
            ObjectMapper objectMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.taskTemplateRepository = taskTemplateRepository;
        this.teacherSubjectRepository = teacherSubjectRepository;
        this.taskSubmissionRepository = taskSubmissionRepository;
        this.objectMapper = objectMapper;
    }
    
    @Transactional
    public List<TaskResponse> createTask(Long teacherId, TaskCreateRequest request) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        
        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        }
        
        TaskTemplate template = null;
        if (request.getTaskTemplateId() != null) {
            template = taskTemplateRepository.findById(request.getTaskTemplateId())
                    .orElse(null);
        }
        
        List<User> students = new ArrayList<>();
        
        // Obtener estudiantes por IDs específicos
        if (request.getStudentIds() != null && !request.getStudentIds().isEmpty()) {
            students = userRepository.findAllById(request.getStudentIds());
        }
        
        // Si no hay estudiantes específicos, buscar por grados
        if (students.isEmpty() && request.getGrades() != null && !request.getGrades().isEmpty()) {
            // Crear una tarea por grado (sin estudiante específico)
            students.add(null);
        }
        
        // Si no hay estudiantes, crear una tarea sin asignar
        if (students.isEmpty()) {
            students.add(null);
        }
        
        List<Task> createdTasks = new ArrayList<>();
        
        // Si hay múltiples grados, crear una tarea por grado
        List<String> gradesToAssign = request.getGrades() != null && !request.getGrades().isEmpty() 
            ? request.getGrades() 
            : List.of((String) null);
        
        for (String grade : gradesToAssign) {
            for (User student : students) {
                Task task = new Task();
                task.setTitle(request.getTitle());
                task.setDescription(request.getDescription());
                task.setDueDate(request.getDueDate());
                task.setTeacher(teacher);
                task.setStudent(student);
                task.setSubject(subject);
                task.setTaskTemplate(template);
                task.setGrade(grade);
                
                if (request.getPriority() != null) {
                    task.setPriority(Task.TaskPriority.valueOf(request.getPriority()));
                }
                
                if (request.getTaskType() != null) {
                    task.setTaskType(Task.TaskType.valueOf(request.getTaskType()));
                }
                
                // Configuración multimedia
                if (request.getAllowedFormats() != null) {
                    try {
                        task.setAllowedFormats(objectMapper.writeValueAsString(request.getAllowedFormats()));
                    } catch (Exception e) {
                        task.setAllowedFormats("[]");
                    }
                }
                task.setMaxFiles(request.getMaxFiles());
                task.setMaxSizeMb(request.getMaxSizeMb());
                
                // Configuración interactiva
                task.setActivityConfig(request.getActivityConfig());
                task.setMaxScore(request.getMaxScore());
                
                if (request.getMaxGrade() != null) {
                    task.setMaxGrade(request.getMaxGrade());
                }
                
                createdTasks.add(taskRepository.save(task));
            }
        }
        
        return createdTasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getTeacherTasks(Long teacherId) {
        List<Task> tasks = taskRepository.findByTeacherId(teacherId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public TaskResponse getTaskById(Long taskId, Long teacherId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para ver esta tarea");
        }
        
        return convertToResponse(task);
    }
    
    @Transactional
    public TaskResponse updateTask(Long taskId, Long teacherId, TaskCreateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para editar esta tarea");
        }
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        
        if (request.getPriority() != null) {
            task.setPriority(Task.TaskPriority.valueOf(request.getPriority()));
        }
        
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
            task.setSubject(subject);
        }
        
        return convertToResponse(taskRepository.save(task));
    }
    
    @Transactional
    public void deleteTask(Long taskId, Long teacherId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para eliminar esta tarea");
        }
        
        taskRepository.delete(task);
    }
    
    @Transactional
    public TaskResponse gradeTask(Long taskId, Long teacherId, TaskGradeRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para calificar esta tarea");
        }
        
        if (task.getStatus() != Task.TaskStatus.SUBMITTED) {
            throw new RuntimeException("La tarea no ha sido entregada");
        }
        
        task.setScore(request.getScore());
        task.setFeedback(request.getFeedback());
        task.setGradedAt(LocalDateTime.now());
        task.setStatus(Task.TaskStatus.GRADED);
        
        return convertToResponse(taskRepository.save(task));
    }
    
    public List<TaskResponse> getSubmittedTasks(Long teacherId) {
        List<Task> tasks = taskRepository.findByTeacherIdAndStatus(teacherId, Task.TaskStatus.SUBMITTED);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getTasksBySubject(Long teacherId, Long subjectId) {
        List<Task> tasks = taskRepository.findByTeacherIdAndSubjectId(teacherId, subjectId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<String> getTeacherGrades(Long teacherId) {
        // Obtener grados únicos asignados al profesor desde teacher_subjects
        List<String> grades = teacherSubjectRepository.findDistinctGradesByTeacherId(teacherId);
        
        // Si no hay grados asignados, devolver lista vacía (no todos los grados)
        if (grades == null || grades.isEmpty()) {
            grades = new ArrayList<>();
        }
        
        return grades;
    }
    
    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setPriority(task.getPriority().name());
        response.setStatus(task.getStatus().name());
        response.setTaskType(task.getTaskType().name());
        
        if (task.getSubject() != null) {
            response.setSubjectId(task.getSubject().getId());
            response.setSubjectName(task.getSubject().getName());
        }
        
        if (task.getTeacher() != null) {
            response.setTeacherId(task.getTeacher().getId());
            response.setTeacherName(task.getTeacher().getFullName());
        }
        
        if (task.getStudent() != null) {
            response.setStudentId(task.getStudent().getId());
            response.setStudentName(task.getStudent().getFullName());
        }
        
        response.setGrade(task.getGrade());
        response.setSubmissionText(task.getSubmissionText());
        response.setSubmissionFileUrl(task.getSubmissionFileUrl());
        response.setSubmittedAt(task.getSubmittedAt());
        response.setScore(task.getScore());
        response.setMaxGrade(task.getMaxGrade());
        response.setFeedback(task.getFeedback());
        response.setGradedAt(task.getGradedAt());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        
        response.setAllowedFormats(task.getAllowedFormats());
        response.setMaxFiles(task.getMaxFiles());
        response.setMaxSizeMb(task.getMaxSizeMb());
        response.setActivityConfig(task.getActivityConfig());
        response.setMaxScore(task.getMaxScore());
        
        // Cargar entregas de estudiantes para esta tarea
        List<TaskSubmission> submissions = taskSubmissionRepository.findByTaskId(task.getId());
        if (submissions != null && !submissions.isEmpty()) {
            // Emails de estudiantes prioritarios para WEKA
            List<String> priorityEmails = List.of(
                "carlos.ramirez@colegio.edu",
                "maria.gonzalez@colegio.edu",
                "jose.martinez@colegio.edu",
                "ana.lopez@colegio.edu",
                "luis.hernandez@colegio.edu",
                "sofia.garcia@colegio.edu"
            );
            
            // Ordenar: primero los estudiantes prioritarios, luego los demás
            List<TaskSubmissionResponse> submissionResponses = submissions.stream()
                .sorted((s1, s2) -> {
                    String email1 = s1.getStudent() != null ? s1.getStudent().getEmail() : "";
                    String email2 = s2.getStudent() != null ? s2.getStudent().getEmail() : "";
                    
                    boolean isPriority1 = priorityEmails.contains(email1);
                    boolean isPriority2 = priorityEmails.contains(email2);
                    
                    if (isPriority1 && !isPriority2) return -1;
                    if (!isPriority1 && isPriority2) return 1;
                    
                    // Si ambos son prioritarios o ambos no lo son, ordenar por fecha de entrega
                    return s1.getSubmittedAt().compareTo(s2.getSubmittedAt());
                })
                .map(this::convertSubmissionToResponse)
                .collect(Collectors.toList());
            response.setSubmissions(submissionResponses);
            response.setSubmissionCount(submissions.size());
        } else {
            response.setSubmissions(new ArrayList<>());
            response.setSubmissionCount(0);
        }
        
        return response;
    }
    
    private TaskSubmissionResponse convertSubmissionToResponse(TaskSubmission submission) {
        TaskSubmissionResponse response = new TaskSubmissionResponse();
        response.setId(submission.getId());
        response.setSubmissionText(submission.getSubmissionText());
        response.setSubmissionFileUrl(submission.getSubmissionFileUrl());
        
        // Parsear archivos del JSON
        if (submission.getSubmissionFiles() != null && !submission.getSubmissionFiles().isEmpty()) {
            try {
                List<String> files = objectMapper.readValue(
                    submission.getSubmissionFiles(), 
                    new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {}
                );
                response.setSubmissionFiles(files);
            } catch (Exception e) {
                // Si falla el parseo, usar el archivo único como fallback
                if (submission.getSubmissionFileUrl() != null) {
                    response.setSubmissionFiles(List.of(submission.getSubmissionFileUrl()));
                } else {
                    response.setSubmissionFiles(new ArrayList<>());
                }
            }
        } else if (submission.getSubmissionFileUrl() != null) {
            // Compatibilidad con entregas antiguas que solo tienen un archivo
            response.setSubmissionFiles(List.of(submission.getSubmissionFileUrl()));
        } else {
            response.setSubmissionFiles(new ArrayList<>());
        }
        
        response.setSubmittedAt(submission.getSubmittedAt());
        response.setStatus(submission.getStatus().name());
        response.setScore(submission.getScore());
        response.setFeedback(submission.getFeedback());
        response.setGradedAt(submission.getGradedAt());
        
        if (submission.getStudent() != null) {
            response.setStudentId(submission.getStudent().getId());
            response.setStudentName(submission.getStudent().getFullName());
            response.setStudentEmail(submission.getStudent().getEmail());
        }
        
        if (submission.getTask() != null) {
            response.setTaskId(submission.getTask().getId());
            response.setTaskTitle(submission.getTask().getTitle());
        }
        
        return response;
    }
}
