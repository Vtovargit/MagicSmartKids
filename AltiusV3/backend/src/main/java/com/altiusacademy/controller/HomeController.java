package com.altiusacademy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
@CrossOrigin(origins = "*")
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🎓 Altius Academy Backend API");
        response.put("status", "RUNNING");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("Health Check", "/api/health");
        endpoints.put("System Info", "/api/info");
        endpoints.put("Users", "/api/users");
        endpoints.put("Login", "/api/auth/login (POST)");
        endpoints.put("Register", "/api/auth/register (POST)");
        endpoints.put("API Documentation", "/swagger-ui.html");
        endpoints.put("Actuator Health", "/actuator/health");
        
        response.put("available_endpoints", endpoints);
        response.put("documentation", "Visit /swagger-ui.html for complete API documentation");
        
        return response;
    }

    @GetMapping("/error")
    @ResponseBody
    public Map<String, Object> error() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🎓 Altius Academy Backend");
        response.put("error", "Endpoint not found");
        response.put("suggestion", "Try /api/health or /swagger-ui.html");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}