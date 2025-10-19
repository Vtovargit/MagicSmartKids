# Altius Academy Backend - Spring Boot

## 🚀 Configuración del Proyecto

### Prerrequisitos
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- MongoDB 5.0+

### Estructura del Proyecto
```
backend/
├── src/main/java/com/altiusacademy/
│   ├── AltiusAcademyApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── SwaggerConfig.java
│   │   └── MongoConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── SubjectController.java
│   │   ├── AssignmentController.java
│   │   ├── GradeController.java
│   │   ├── FileController.java
│   │   ├── ActivityController.java
│   │   ├── ReportController.java
│   │   └── CalendarController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── SubjectService.java
│   │   ├── AssignmentService.java
│   │   ├── GradeService.java
│   │   ├── FileService.java
│   │   ├── ActivityService.java
│   │   ├── ReportService.java
│   │   ├── CalendarService.java
│   │   └── EmailService.java
│   ├── repository/
│   │   ├── mysql/
│   │   │   ├── UserRepository.java
│   │   │   ├── SubjectRepository.java
│   │   │   ├── AssignmentRepository.java
│   │   │   ├── GradeRepository.java
│   │   │   └── CalendarEventRepository.java
│   │   └── mongodb/
│   │       ├── ActivityRepository.java
│   │       ├── FileRepository.java
│   │       └── LogRepository.java
│   ├── model/
│   │   ├── entity/ (MySQL Entities)
│   │   │   ├── User.java
│   │   │   ├── Institution.java
│   │   │   ├── Subject.java
│   │   │   ├── Assignment.java
│   │   │   ├── Submission.java
│   │   │   ├── Grade.java
│   │   │   └── CalendarEvent.java
│   │   ├── document/ (MongoDB Documents)
│   │   │   ├── Activity.java
│   │   │   ├── Question.java
│   │   │   ├── FileDocument.java
│   │   │   └── AuditLog.java
│   │   └── dto/
│   │       ├── request/
│   │       │   ├── LoginRequest.java
│   │       │   ├── RegisterRequest.java
│   │       │   ├── CreateAssignmentRequest.java
│   │       │   └── SubmitAssignmentRequest.java
│   │       └── response/
│   │           ├── AuthResponse.java
│   │           ├── UserResponse.java
│   │           ├── AssignmentResponse.java
│   │           └── GradeResponse.java
│   ├── security/
│   │   ├── JwtAuthenticationEntryPoint.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtTokenProvider.java
│   │   └── UserPrincipal.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── BadRequestException.java
│   │   └── UnauthorizedException.java
│   └── util/
│       ├── DateUtils.java
│       ├── FileUtils.java
│       └── ValidationUtils.java
└── src/main/resources/
    ├── application.properties
    ├── application-dev.properties
    ├── application-prod.properties
    └── data.sql
```

## 📊 Base de Datos

### MySQL - Datos Relacionales
```sql
-- Instituciones
CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    director VARCHAR(255),
    type ENUM('public', 'private', 'mixed') DEFAULT 'public',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuarios
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'secretary', 'coordinator', 'teacher', 'student', 'parent') NOT NULL,
    institution_id BIGINT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

-- Materias
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade_level VARCHAR(10) NOT NULL,
    teacher_id BIGINT NOT NULL,
    institution_id BIGINT NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

-- Tareas
CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    type ENUM('quiz', 'file_upload', 'both') DEFAULT 'quiz',
    due_date DATETIME,
    total_points INT DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Entregas de tareas
CREATE TABLE submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(5,2),
    feedback TEXT,
    status ENUM('pending', 'graded', 'late') DEFAULT 'pending',
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Notas
CREATE TABLE grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    assignment_id BIGINT,
    value DECIMAL(3,2) NOT NULL,
    max_value DECIMAL(3,2) DEFAULT 5.0,
    period VARCHAR(20) NOT NULL,
    type ENUM('assignment', 'exam', 'participation') DEFAULT 'assignment',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

-- Eventos del calendario
CREATE TABLE calendar_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    type ENUM('assignment', 'exam', 'meeting', 'holiday') NOT NULL,
    subject_id BIGINT,
    institution_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Relación padre-hijo
CREATE TABLE parent_student_relations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    relationship_type ENUM('father', 'mother', 'guardian') DEFAULT 'guardian',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    UNIQUE KEY unique_parent_student (parent_id, student_id)
);
```

### MongoDB - Actividades y Archivos
```javascript
// Colección: activities
{
  "_id": ObjectId,
  "assignmentId": Long,
  "type": "quiz", // quiz, fill_blank, true_false
  "title": String,
  "description": String,
  "questions": [
    {
      "id": String,
      "type": "multiple_choice", // multiple_choice, true_false, fill_blank
      "question": String,
      "options": [String], // Solo para multiple_choice
      "correctAnswer": String,
      "points": Number,
      "explanation": String
    }
  ],
  "timeLimit": Number, // minutos
  "attempts": Number,
  "createdAt": Date,
  "updatedAt": Date
}

// Colección: student_answers
{
  "_id": ObjectId,
  "submissionId": Long,
  "studentId": Long,
  "activityId": ObjectId,
  "answers": [
    {
      "questionId": String,
      "answer": String,
      "isCorrect": Boolean,
      "timeSpent": Number // segundos
    }
  ],
  "totalScore": Number,
  "completedAt": Date,
  "timeSpent": Number // segundos totales
}

// Colección: files
{
  "_id": ObjectId,
  "originalName": String,
  "fileName": String,
  "filePath": String,
  "mimeType": String,
  "size": Number,
  "uploadedBy": Long,
  "assignmentId": Long,
  "submissionId": Long,
  "type": "assignment_file", // assignment_file, submission_file, profile_image
  "uploadedAt": Date
}

// Colección: audit_logs
{
  "_id": ObjectId,
  "userId": Long,
  "action": String,
  "resource": String,
  "resourceId": String,
  "details": Object,
  "ipAddress": String,
  "userAgent": String,
  "timestamp": Date
}
```

## ⚙️ Configuración

### application.properties
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration - MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/altius_academy?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:password}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/altius_academy_activities
spring.data.mongodb.auto-index-creation=true

# JWT Configuration
jwt.secret=${JWT_SECRET:altiusAcademySecretKey2025VerySecureKey}
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true

# Logging
logging.level.com.altiusacademy=DEBUG
logging.level.org.springframework.security=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# Swagger Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
```

## 🔐 Seguridad JWT

### Configuración de Seguridad
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/coordinator/**").hasAnyRole("COORDINATOR", "ADMIN")
                .requestMatchers("/teacher/**").hasAnyRole("TEACHER", "COORDINATOR", "ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

## 📡 Endpoints Principales

### Autenticación
```
POST /auth/login
POST /auth/register
POST /auth/refresh
PUT  /auth/change-password
POST /auth/forgot-password
POST /auth/reset-password
```

### Usuarios
```
GET    /users/profile
PUT    /users/profile
GET    /users/role/{role}
PUT    /users/{id}/activate
PUT    /users/{id}/deactivate
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}
```

### Materias
```
GET    /subjects
POST   /subjects
GET    /subjects/{id}
PUT    /subjects/{id}
DELETE /subjects/{id}
GET    /subjects/teacher/{teacherId}
GET    /subjects/institution/{institutionId}
```

### Tareas
```
GET    /assignments
POST   /assignments
GET    /assignments/{id}
PUT    /assignments/{id}
DELETE /assignments/{id}
GET    /assignments/subject/{subjectId}
GET    /assignments/student/{studentId}
POST   /assignments/{id}/submit
PUT    /assignments/submissions/{id}/grade
GET    /assignments/{id}/submissions
```

### Notas
```
GET    /grades/student/{studentId}
GET    /grades/subject/{subjectId}
GET    /grades/student/{studentId}/period/{period}
GET    /grades/student/{studentId}/comparative
POST   /grades
PUT    /grades/{id}
DELETE /grades/{id}
```

### Actividades (MongoDB)
```
GET    /activities
POST   /activities
GET    /activities/{id}
PUT    /activities/{id}
DELETE /activities/{id}
POST   /activities/{id}/solve
GET    /activities/assignment/{assignmentId}
```

### Archivos
```
POST   /files/upload
GET    /files/{id}
DELETE /files/{id}
GET    /files/assignment/{assignmentId}
GET    /files/submission/{submissionId}
```

### Reportes
```
GET    /reports/students-by-grade
GET    /reports/averages-by-subject
GET    /reports/teacher-stats
GET    /reports/institution/{id}/stats
GET    /reports/global-stats
POST   /reports/export/{type}
```

### Calendario
```
GET    /calendar/events
POST   /calendar/events
GET    /calendar/events/{id}
PUT    /calendar/events/{id}
DELETE /calendar/events/{id}
GET    /calendar/events/range
```

## 🚀 Comandos de Ejecución

### Desarrollo
```bash
# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Ejecutar aplicación
mvn spring-boot:run

# Generar JAR
mvn clean package

# Ejecutar JAR
java -jar target/altius-academy-backend-1.0.0.jar
```

### Docker
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/altius-academy-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: altius_academy
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - mongodb
    environment:
      DB_USERNAME: root
      DB_PASSWORD: password
      JWT_SECRET: altiusAcademySecretKey2025VerySecureKey

volumes:
  mysql_data:
  mongodb_data:
```

## 📚 Swagger Documentation

Accede a la documentación de la API en:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## 🧪 Testing

### Estructura de Tests
```
src/test/java/com/altiusacademy/
├── controller/
│   ├── AuthControllerTest.java
│   ├── UserControllerTest.java
│   └── AssignmentControllerTest.java
├── service/
│   ├── AuthServiceTest.java
│   ├── UserServiceTest.java
│   └── AssignmentServiceTest.java
└── integration/
    ├── AuthIntegrationTest.java
    └── AssignmentIntegrationTest.java
```

### Ejecutar Tests
```bash
# Todos los tests
mvn test

# Tests específicos
mvn test -Dtest=AuthControllerTest

# Tests de integración
mvn test -Dtest=*IntegrationTest

# Coverage report
mvn jacoco:report
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```bash
export DB_USERNAME=root
export DB_PASSWORD=password
export JWT_SECRET=altiusAcademySecretKey2025VerySecureKey
export EMAIL_USERNAME=your-email@gmail.com
export EMAIL_PASSWORD=your-app-password
```

### Perfiles de Spring
```bash
# Desarrollo
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Producción
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📈 Monitoreo y Logs

### Actuator Endpoints
```
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
GET /actuator/loggers
```

### Configuración de Logs
```properties
# application.properties
logging.level.com.altiusacademy=DEBUG
logging.file.name=logs/altius-academy.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

## 🚀 Deployment

### Preparación para Producción
1. Configurar variables de entorno
2. Configurar base de datos de producción
3. Configurar servidor de email
4. Generar certificados SSL
5. Configurar reverse proxy (Nginx)

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.altiusacademy.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Este backend está completamente configurado para conectar con el frontend React y proporciona todas las funcionalidades requeridas para Altius Academy.