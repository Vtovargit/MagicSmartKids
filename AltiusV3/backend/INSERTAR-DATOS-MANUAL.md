# 🚀 INSERTAR DATOS FICTICIOS MANUALMENTE

## Pasos para insertar 100 usuarios ficticios + materias + tareas

### 1. Abrir MySQL Workbench o línea de comandos de MySQL

### 2. Conectarse a la base de datos:
```sql
USE altiusv3;
```

### 3. Ejecutar los siguientes scripts en orden:

#### A) Insertar instituciones (si no existen):
```sql
source insert-institutions-direct.sql;
```

#### B) Insertar materias y tareas:
```sql
source insert-tasks-and-subjects.sql;
```

#### C) Insertar 100 usuarios ficticios:
```sql
source insert-users-sample.sql;
```

### 4. Verificar que todo se insertó correctamente:
```sql
-- Ver resumen de datos
SELECT 'INSTITUCIONES' as tabla, COUNT(*) as total FROM institutions
UNION ALL
SELECT 'MATERIAS' as tabla, COUNT(*) as total FROM subjects
UNION ALL
SELECT 'TAREAS' as tabla, COUNT(*) as total FROM tasks
UNION ALL
SELECT 'PREGUNTAS' as tabla, COUNT(*) as total FROM questions
UNION ALL
SELECT 'PROFESORES' as tabla, COUNT(*) as total FROM users WHERE role = 'TEACHER'
UNION ALL
SELECT 'ESTUDIANTES' as tabla, COUNT(*) as total FROM users WHERE role = 'STUDENT';

-- Ver distribución por institución
SELECT 
    i.name as institucion,
    u.role as rol,
    COUNT(*) as cantidad
FROM users u
JOIN institutions i ON u.institution_id = i.id
WHERE u.role IN ('TEACHER', 'STUDENT')
GROUP BY i.name, u.role
ORDER BY i.name, u.role;
```

## 🎯 Resultado esperado:
- ✅ 20 Instituciones
- ✅ 10 Materias
- ✅ 10 Tareas con 30 preguntas
- ✅ 50 Profesores ficticios
- ✅ 50 Estudiantes ficticios

## 🚀 Después de insertar los datos:

1. **Iniciar el backend:**
```bash
mvn spring-boot:run
```

2. **Iniciar el frontend:**
```bash
npm run dev
```

3. **Probar el sistema:**
- Coordinador: Ver listas de profesores y estudiantes
- Profesor: Ver y crear tareas
- Estudiante: Ver tareas disponibles

## 📧 Usuarios de prueba creados:

### Profesores:
- ana.garcia@profesor.edu.co
- carlos.rodriguez@profesor.edu.co
- maria.lopez@profesor.edu.co
- (y 47 más...)

### Estudiantes:
- sofia.martin@estudiante.edu.co
- mateo.garcia@estudiante.edu.co
- valentina.lopez@estudiante.edu.co
- (y 47 más...)

**Contraseña para todos:** `password123` (encriptada en BD)

## 🔧 Si hay problemas:

1. Verificar que MySQL esté corriendo
2. Verificar que la base de datos `altiusv3` exista
3. Verificar que las tablas estén creadas
4. Revisar logs del backend para errores de conexión