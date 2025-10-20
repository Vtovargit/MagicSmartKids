package com.altiusacademy.service;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.UserRepository;
import com.altiusacademy.repository.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InstitutionRepository institutionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<User> getStudentsByInstitution(Long institutionId) {
        logger.info("Obteniendo estudiantes de la institución: {}", institutionId);
        return userRepository.findByInstitutionIdAndRoleEnum(institutionId, UserRole.STUDENT);
    }
    
    public User createStudent(User student, Long institutionId) {
        logger.info("Creando nuevo estudiante para institución: {}", institutionId);
        
        // Verificar que la institución existe
        Optional<Institution> institution = institutionRepository.findById(institutionId);
        if (!institution.isPresent()) {
            throw new RuntimeException("Institución no encontrada");
        }
        
        // Verificar que el email no existe
        if (userRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Configurar el estudiante
        student.setRole(UserRole.STUDENT);
        student.setInstitution(institution.get());
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        
        User savedStudent = userRepository.save(student);
        logger.info("Estudiante creado exitosamente: {}", savedStudent.getEmail());
        
        return savedStudent;
    }
    
    public User updateStudent(Long studentId, User updatedStudent, Long teacherInstitutionId) {
        logger.info("Actualizando estudiante: {}", studentId);
        
        Optional<User> existingStudent = userRepository.findById(studentId);
        if (!existingStudent.isPresent()) {
            throw new RuntimeException("Estudiante no encontrado");
        }
        
        User student = existingStudent.get();
        
        // Verificar que el estudiante pertenece a la misma institución del profesor
        if (!student.getInstitution().getId().equals(teacherInstitutionId)) {
            throw new RuntimeException("No tienes permisos para editar este estudiante");
        }
        
        // Actualizar campos permitidos
        student.setFirstName(updatedStudent.getFirstName());
        student.setLastName(updatedStudent.getLastName());
        student.setPhone(updatedStudent.getPhone());
        
        // Solo actualizar email si es diferente y no existe
        if (!student.getEmail().equals(updatedStudent.getEmail())) {
            if (userRepository.findByEmail(updatedStudent.getEmail()).isPresent()) {
                throw new RuntimeException("El email ya está registrado");
            }
            student.setEmail(updatedStudent.getEmail());
        }
        
        // Solo actualizar contraseña si se proporciona una nueva
        if (updatedStudent.getPassword() != null && !updatedStudent.getPassword().isEmpty()) {
            student.setPassword(passwordEncoder.encode(updatedStudent.getPassword()));
        }
        
        User savedStudent = userRepository.save(student);
        logger.info("Estudiante actualizado exitosamente: {}", savedStudent.getEmail());
        
        return savedStudent;
    }
    
    public void deleteStudent(Long studentId, Long teacherInstitutionId) {
        logger.info("Eliminando estudiante: {}", studentId);
        
        Optional<User> existingStudent = userRepository.findById(studentId);
        if (!existingStudent.isPresent()) {
            throw new RuntimeException("Estudiante no encontrado");
        }
        
        User student = existingStudent.get();
        
        // Verificar que el estudiante pertenece a la misma institución del profesor
        if (!student.getInstitution().getId().equals(teacherInstitutionId)) {
            throw new RuntimeException("No tienes permisos para eliminar este estudiante");
        }
        
        userRepository.delete(student);
        logger.info("Estudiante eliminado exitosamente: {}", student.getEmail());
    }
    
    public User getStudentById(Long studentId, Long teacherInstitutionId) {
        logger.info("Obteniendo estudiante: {}", studentId);
        
        Optional<User> student = userRepository.findById(studentId);
        if (!student.isPresent()) {
            throw new RuntimeException("Estudiante no encontrado");
        }
        
        // Verificar que el estudiante pertenece a la misma institución del profesor
        if (!student.get().getInstitution().getId().equals(teacherInstitutionId)) {
            throw new RuntimeException("No tienes permisos para ver este estudiante");
        }
        
        return student.get();
    }
}