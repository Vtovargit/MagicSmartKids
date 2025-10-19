# Altius Academy Backend - Documentación

## 🚀 BLOQUE 1: Sistema de Autenticación JWT + MySQL ✅

### Archivos Creados/Modificados

#### Nuevos Archivos Creados:
- `src/main/java/com/altiusacademy/service/AuthService.java` - Servicio de autenticación
- `src/main/java/com/altiusacademy/dto/LoginRequest.java` - DTO para login
- `src/main/java/com/altiusacademy/dto/RegisterRequest.java` - DTO para registro
- `src/main/java/com/altiusacademy/dto/AuthResponse.java` - DTO de respuesta de autenticación
- `src/main/java/com/altiusacademy/repository/UserRepository.java` - Repositorio JPA para usuarios
- `src/main/java/com/altiusacademy/security/JwtTokenProvider.java` - Proveedor de tokens JWT
- `src/main/java/com/altiusacademy/security/CustomUserDetailsService.java` - Servicio de detalles de usuario

#### Archivos Modificados:
- `src/main/java/com/altiusacademy/controller/AuthController.java` - Actualizado con JWT real
- `src/main/java/com/altiusacademy/config/SecurityConfig.java` - Configuración de seguridad actualizada
- `src/main/java/com/altiusacademy/security/JwtAuthenticationFilter.java` - Filtro JWT funcional
- `src/main/resources/application.properties` - Configuración de MySQL corregida

### Configuración de Base de Datos

**MySQL (Principal):**
- Host: 127.0.0.1:3306
- Base de datos: AltiusV3 (se crea automáticamente)
- Usuario: root
- Password: 120994

**MongoDB (Actividades Interactivas):**
- URI: mongodb://localhost:27017/altius

### Comandos para Iniciar

#### Backend (Puerto 8090):
```bash
cd project/backend
mvn spring-boot:run
```

#### Frontend (Puerto 3001):
```bash
cd project
npm run dev
```

### Endpoints de Autenticación

#### 1. Registro de Usuario
```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "profesor@test.com",
    "password": "123456",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "PROFESOR"
  }'
```

#### 2. Login de Usuario
```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "profesor@test.com",
    "password": "123456"
  }'
```

#### 3. Logout
```bash
curl -X POST http://localhost:8085/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Roles Disponibles
- **PROFESOR**: Puede crear quizzes, ver resultados, gestionar asistencia
- **ESTUDIANTE**: Puede resolver quizzes, marcar asistencia

### Funcionalidades Implementadas ✅

1. **Autenticación JWT completa**
   - Registro con validaciones
   - Login con generación de token
   - Filtro de autenticación en requests
   - Manejo de roles (PROFESOR/ESTUDIANTE)

2. **Seguridad Spring Security**
   - Configuración moderna (Spring Boot 3.x)
   - Endpoints públicos y protegidos
   - Validación de tokens JWT

3. **Base de Datos MySQL**
   - Conexión configurada correctamente
   - Entidades JPA creadas
   - Repositorios funcionales

4. **Validaciones**
   - DTOs con validaciones Jakarta
   - Manejo de errores personalizado

### Próximos Bloques

**BLOQUE 2: CRUD de Quizzes (MySQL)**
- Entidades Quiz, Question, Answer
- Controladores para profesores y estudiantes
- Persistencia de resultados

**BLOQUE 3: Sistema de Asistencia con QR**
- Generación de códigos QR temporales
- Endpoints para marcar asistencia
- Integración con APIs gratuitas de QR

**BLOQUE 4: Actividades Interactivas (MongoDB)**
- Esquemas MongoDB para actividades
- Endpoints CRUD para actividades
- Preparación para integración con Konva

### Estado del Proyecto
- ✅ Backend compilando correctamente
- ✅ Autenticación JWT funcional
- ✅ Base de datos MySQL configurada
- ✅ Endpoints de auth listos para pruebas
- 🔄 Próximo: CRUD de Quizzes

### Notas Técnicas
- Java 17 + Spring Boot 3.2.1
- JWT con biblioteca jjwt 0.11.5
- MySQL con Hibernate/JPA
- Validaciones con Jakarta Validation
- Configuración de CORS habilitada para desarrollo