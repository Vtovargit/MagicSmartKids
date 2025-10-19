package com.altiusacademy.controller;

import com.altiusacademy.dto.AuthResponse;
import com.altiusacademy.dto.LoginRequest;
import com.altiusacademy.dto.RegisterRequest;
import com.altiusacademy.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint de login - valida email y password contra MySQL
     * Devuelve token JWT válido si las credenciales son correctas
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Procesando login para: " + loginRequest.getEmail());
            
            // Validar credenciales y generar token JWT
            AuthResponse authResponse = authService.login(loginRequest);
            
            // Respuesta exitosa con formato JSON requerido
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("userId", authResponse.getUserId());
            response.put("email", authResponse.getEmail());
            response.put("firstName", authResponse.getFirstName());
            response.put("lastName", authResponse.getLastName());
            response.put("role", authResponse.getRole());
            response.put("token", authResponse.getToken());
            response.put("tokenType", authResponse.getTokenType());
            response.put("institution", authResponse.getInstitution()); // ✅ INCLUIR INSTITUCIÓN
            response.put("academicGrade", authResponse.getAcademicGrade()); // ✅ INCLUIR GRADO ACADÉMICO (puede ser null)
            
            System.out.println("✅ Login exitoso - Usuario ID: " + authResponse.getUserId() + ", Rol: " + authResponse.getRole());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Login fallido para " + loginRequest.getEmail() + ": " + e.getMessage());
            
            // Respuesta de error con formato JSON requerido
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Credenciales inválidas");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint de registro - crea usuario en MySQL con contraseña cifrada
     * Valida que el email no esté duplicado y convierte roles correctamente
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("📝 Procesando registro:");
            System.out.println("   Email: " + registerRequest.getEmail());
            System.out.println("   Nombre: " + registerRequest.getFirstName() + " " + registerRequest.getLastName());
            System.out.println("   Rol solicitado: " + registerRequest.getRole());
            
            // Crear usuario en MySQL y generar token JWT
            AuthResponse authResponse = authService.register(registerRequest);
            
            // Respuesta exitosa con formato JSON requerido
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario registrado correctamente");
            
            // Objeto user con datos del usuario creado
            Map<String, Object> user = new HashMap<>();
            user.put("id", authResponse.getUserId());
            user.put("firstName", authResponse.getFirstName());
            user.put("lastName", authResponse.getLastName());
            user.put("email", authResponse.getEmail());
            user.put("role", authResponse.getRole());
            
            response.put("user", user);
            response.put("userId", authResponse.getUserId());
            response.put("email", authResponse.getEmail());
            response.put("firstName", authResponse.getFirstName());
            response.put("lastName", authResponse.getLastName());
            response.put("role", authResponse.getRole());
            response.put("token", authResponse.getToken());
            response.put("tokenType", authResponse.getTokenType());
            
            System.out.println("✅ Usuario registrado exitosamente:");
            System.out.println("   ID: " + authResponse.getUserId());
            System.out.println("   Email: " + authResponse.getEmail());
            System.out.println("   Rol final: " + authResponse.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en registro: " + e.getMessage());
            
            // Determinar el mensaje de error específico
            String errorMessage = e.getMessage();
            if (errorMessage.contains("ya está registrado") || errorMessage.contains("already exists")) {
                errorMessage = "El correo ya está registrado";
            }
            
            // Respuesta de error con formato JSON requerido
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", errorMessage);
            return ResponseEntity.badRequest().body(response);
        }
    }



    /**
     * Endpoint para cerrar sesión (logout)
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Sesión cerrada exitosamente");
        return ResponseEntity.ok(response);
    }
}