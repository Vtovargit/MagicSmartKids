package com.altiusacademy.controller;

import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.service.UserInstitutionRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-institution-roles")
@CrossOrigin(origins = "*")
public class UserInstitutionRoleController {
    
    @Autowired
    private UserInstitutionRoleService userInstitutionRoleService;
    
    /**
     * Asignar un usuario a una institución con un rol
     */
    @PostMapping("/assign")
    public ResponseEntity<Map<String, Object>> assignUserToInstitution(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long institutionId = Long.valueOf(request.get("institutionId").toString());
            String role = request.get("role").toString();
            
            UserInstitutionRole assignment = userInstitutionRoleService.assignUserToInstitution(userId, institutionId, role);
            
            response.put("success", true);
            response.put("message", "Usuario asignado correctamente a la institución");
            response.put("assignment", assignment);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener todas las instituciones de un usuario
     */
    @GetMapping("/user/{userId}/institutions")
    public ResponseEntity<Map<String, Object>> getUserInstitutions(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<UserInstitutionRole> institutions = userInstitutionRoleService.getUserInstitutions(userId);
            
            response.put("success", true);
            response.put("institutions", institutions);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener todos los usuarios de una institución
     */
    @GetMapping("/institution/{institutionId}/users")
    public ResponseEntity<Map<String, Object>> getInstitutionUsers(@PathVariable Long institutionId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<UserInstitutionRole> users = userInstitutionRoleService.getInstitutionUsers(institutionId);
            
            response.put("success", true);
            response.put("users", users);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener usuarios por institución y rol
     */
    @GetMapping("/institution/{institutionId}/role/{role}")
    public ResponseEntity<Map<String, Object>> getUsersByInstitutionAndRole(
            @PathVariable Long institutionId, 
            @PathVariable String role) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<UserInstitutionRole> users = userInstitutionRoleService.getUsersByInstitutionAndRole(institutionId, role);
            
            response.put("success", true);
            response.put("users", users);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Desactivar una asignación usuario-institución-rol
     */
    @DeleteMapping("/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateUserInstitutionRole(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long institutionId = Long.valueOf(request.get("institutionId").toString());
            String role = request.get("role").toString();
            
            userInstitutionRoleService.deactivateUserInstitutionRole(userId, institutionId, role);
            
            response.put("success", true);
            response.put("message", "Asignación desactivada correctamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Verificar si un usuario tiene un rol en una institución
     */
    @GetMapping("/check/{userId}/{institutionId}/{role}")
    public ResponseEntity<Map<String, Object>> checkUserRoleInInstitution(
            @PathVariable Long userId,
            @PathVariable Long institutionId,
            @PathVariable String role) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean hasRole = userInstitutionRoleService.hasUserRoleInInstitution(userId, institutionId, role);
            
            response.put("success", true);
            response.put("hasRole", hasRole);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}