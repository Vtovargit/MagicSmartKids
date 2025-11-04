-- Script para crear usuarios de ejemplo en AltiusV3
-- 1 estudiante, 1 admin, 1 profesor y 1 coordinador

-- Primero, crear una institución de ejemplo si no existe
INSERT IGNORE INTO institutions (name, nit, address, phone, email, is_active, created_at, updated_at)
VALUES ('Colegio San José', '900123456-1', 'Calle 123 #45-67, Bogotá', '601-2345678', 'info@colegiosanjose.edu.co', true, NOW(), NOW());

-- Obtener el ID de la institución (asumiendo que es la primera o única)
SET @institution_id = (SELECT id FROM institutions WHERE name = 'Colegio San José' LIMIT 1);

-- Crear un grado escolar de ejemplo si no existe
INSERT IGNORE INTO school_grades (grade_name, grade_level, description, is_active, created_at, updated_at)
VALUES ('5° A', 5, 'Quinto grado sección A', true, NOW(), NOW());

-- Obtener el ID del grado escolar
SET @grade_id = (SELECT id FROM school_grades WHERE grade_name = '5° A' LIMIT 1);

-- Crear los usuarios
-- Nota: Las contraseñas están hasheadas con BCrypt para "123456"
-- Hash BCrypt de "123456": $2a$10$N9qo8uLOickgx2ZMRZoMye/Ci/AB2QQqx4WNoUVLijfxR42BpMYxW

-- 1. ADMIN
INSERT IGNORE INTO users (email, password, first_name, last_name, role, institution_id, phone, is_active, email_verified, created_at, updated_at)
VALUES (
    'admin@colegiosanjose.edu.co',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye/Ci/AB2QQqx4WNoUVLijfxR42BpMYxW',
    'María',
    'González',
    'ADMIN',
    @institution_id,
    '3001234567',
    true,
    true,
    NOW(),
    NOW()
);

-- 2. COORDINADOR
INSERT INTO users (email, password, first_name, last_name, role, institution_id, phone, is_active, email_verified, created_at, updated_at)
VALUES (
    'coordinador@colegiosanjose.edu.co',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye/Ci/AB2QQqx4WNoUVLijfxR42BpMYxW',
    'Carlos',
    'Rodríguez',
    'COORDINATOR',
    @institution_id,
    '3009876543',
    true,
    true,
    NOW(),
    NOW()
);

-- 3. PROFESOR
INSERT INTO users (email, password, first_name, last_name, role, institution_id, phone, is_active, email_verified, created_at, updated_at)
VALUES (
    'profesor@colegiosanjose.edu.co',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye/Ci/AB2QQqx4WNoUVLijfxR42BpMYxW',
    'Ana',
    'Martínez',
    'TEACHER',
    @institution_id,
    '3005551234',
    true,
    true,
    NOW(),
    NOW()
);

-- 4. ESTUDIANTE
INSERT INTO users (email, password, first_name, last_name, role, institution_id, school_grade_id, phone, is_active, email_verified, created_at, updated_at)
VALUES (
    'estudiante@colegiosanjose.edu.co',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye/Ci/AB2QQqx4WNoUVLijfxR42BpMYxW',
    'Juan',
    'Pérez',
    'STUDENT',
    @institution_id,
    @grade_id,
    '3007778888',
    true,
    true,
    NOW(),
    NOW()
);

-- Crear las relaciones usuario-institución-rol en la tabla user_institution_roles
-- Obtener los IDs de los usuarios creados
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@colegiosanjose.edu.co');
SET @coordinator_id = (SELECT id FROM users WHERE email = 'coordinador@colegiosanjose.edu.co');
SET @teacher_id = (SELECT id FROM users WHERE email = 'profesor@colegiosanjose.edu.co');
SET @student_id = (SELECT id FROM users WHERE email = 'estudiante@colegiosanjose.edu.co');

-- Insertar relaciones usuario-institución-rol
INSERT INTO user_institution_roles (user_id, institution_id, role, active, created_at, updated_at)
VALUES 
    (@admin_id, @institution_id, 'ADMIN', true, NOW(), NOW()),
    (@coordinator_id, @institution_id, 'COORDINATOR', true, NOW(), NOW()),
    (@teacher_id, @institution_id, 'TEACHER', true, NOW(), NOW()),
    (@student_id, @institution_id, 'STUDENT', true, NOW(), NOW());

-- Mostrar los usuarios creados
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    i.name as institution_name,
    sg.grade_name,
    u.phone,
    u.is_active,
    u.created_at
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
LEFT JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE u.email IN (
    'admin@colegiosanjose.edu.co',
    'coordinador@colegiosanjose.edu.co',
    'profesor@colegiosanjose.edu.co',
    'estudiante@colegiosanjose.edu.co'
)
ORDER BY u.role;

-- Información de acceso
SELECT '=== INFORMACIÓN DE ACCESO ===' as info;

SELECT 
    'Email: admin@colegiosanjose.edu.co' as admin_info,
    'Contraseña: 123456' as admin_password,
    'Rol: Administrador' as admin_role
UNION ALL
SELECT 
    'Email: coordinador@colegiosanjose.edu.co',
    'Contraseña: 123456',
    'Rol: Coordinador'
UNION ALL
SELECT 
    'Email: profesor@colegiosanjose.edu.co',
    'Contraseña: 123456',
    'Rol: Profesor'
UNION ALL
SELECT 
    'Email: estudiante@colegiosanjose.edu.co',
    'Contraseña: 123456',
    'Rol: Estudiante';