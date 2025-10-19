-- Insertar datos de prueba directamente
USE altiusv3;

-- Insertar instituciones si no existen
INSERT IGNORE INTO institutions (id, name, address, phone, email, is_active, created_at, updated_at) VALUES
(1, 'Colegio San Martín', 'Calle 123 #45-67, Bogotá', '601-2345678', 'info@sanmartin.edu.co', true, NOW(), NOW()),
(2, 'Instituto Los Pinares', 'Carrera 89 #12-34, Medellín', '604-8765432', 'contacto@lospinares.edu.co', true, NOW(), NOW()),
(3, 'Escuela Nuevo Horizonte', 'Avenida 56 #78-90, Cali', '602-5551234', 'admin@nuevohorizonte.edu.co', true, NOW(), NOW());

-- Insertar usuarios de prueba si no existen
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
-- Coordinadores
('Ana María', 'Rodríguez', 'coordinador@sanmartin.edu.co', '$2a$10$example', 'COORDINATOR', 1, true, NOW()),
('Carlos Eduardo', 'Gómez', 'coordinador@lospinares.edu.co', '$2a$10$example', 'COORDINATOR', 2, true, NOW()),
('María Elena', 'Vargas', 'coordinador@nuevohorizonte.edu.co', '$2a$10$example', 'COORDINATOR', 3, true, NOW()),

-- Profesores
('Laura', 'García', 'laura.garcia@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Sandra', 'Vargas', 'sandra.vargas@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Natalia', 'Romero', 'natalia.romero@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),

-- Estudiantes
('Sofía', 'Martín', 'sofia.martin@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Lucía', 'Flores', 'lucia.flores@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Amelia', 'Mendoza', 'amelia.mendoza@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW());

-- Verificar datos insertados
SELECT 'INSTITUCIONES:' as tipo;
SELECT id, name FROM institutions WHERE is_active = true;

SELECT 'USUARIOS CON INSTITUCIONES:' as tipo;
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.institution_id,
    i.name as institution_name
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
WHERE u.is_active = true
ORDER BY u.institution_id, u.role;

SELECT '¡Datos de prueba insertados!' as resultado;