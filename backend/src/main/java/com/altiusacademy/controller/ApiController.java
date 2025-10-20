package com.altiusacademy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping
    public Map<String, Object> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("api", "Altius Academy Backend API");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "ACTIVE");
        
        List<Map<String, String>> endpoints = new ArrayList<>();
        
        // Health endpoints
        endpoints.add(createEndpoint("GET", "/api/health", "System health check"));
        endpoints.add(createEndpoint("GET", "/api/info", "System information"));
        
        // Auth endpoints
        endpoints.add(createEndpoint("POST", "/api/auth/login", "User authentication"));
        endpoints.add(createEndpoint("POST", "/api/auth/register", "User registration"));
        endpoints.add(createEndpoint("POST", "/api/auth/logout", "User logout"));
        
        // User endpoints
        endpoints.add(createEndpoint("GET", "/api/users", "List all users"));
        endpoints.add(createEndpoint("GET", "/api/users/{id}", "Get user by ID"));
        endpoints.add(createEndpoint("POST", "/api/users", "Create new user"));
        endpoints.add(createEndpoint("PUT", "/api/users/{id}", "Update user"));
        endpoints.add(createEndpoint("DELETE", "/api/users/{id}", "Delete user"));
        
        // Database Test endpoints
        endpoints.add(createEndpoint("GET", "/api/database-test/status", "Database connection status"));
        endpoints.add(createEndpoint("POST", "/api/database-test/create-test-user", "Create test user"));
        endpoints.add(createEndpoint("GET", "/api/database-test/users", "List all users from DB"));
        endpoints.add(createEndpoint("DELETE", "/api/database-test/delete-test-user", "Delete test user"));
        endpoints.add(createEndpoint("POST", "/api/database-test/create-sample-users", "Create sample users"));
        
        // Documentation
        endpoints.add(createEndpoint("GET", "/swagger-ui.html", "API Documentation"));
        endpoints.add(createEndpoint("GET", "/actuator/health", "Actuator health"));
        
        response.put("endpoints", endpoints);
        response.put("documentation", "Visit /swagger-ui.html for interactive API documentation");
        
        return response;
    }
    
    private Map<String, String> createEndpoint(String method, String path, String description) {
        Map<String, String> endpoint = new HashMap<>();
        endpoint.put("method", method);
        endpoint.put("path", path);
        endpoint.put("description", description);
        return endpoint;
    }
}