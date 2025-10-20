-- Script para verificar datos de instituciones y usuarios
USE altiusv3;

-- 1. Verificar instituciones
SELECT 'INSTITUCIONES EN LA BASE DE DATOS:' as mensaje;
SELECT id, name, address, is_active FROM institutions ORDER BY id;

-- 2. Verificar usuarios con sus instituciones
SELECT 'USUARIOS CON INSTITUCIONES:' as mensaje;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.role,
    u.institution_id,
    i.name as institution_name,
    u.is_active
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
WHERE u.is_active = true
ORDER BY u.institution_id, u.role, u.first_name
LIMIT 20;

-- 3. Contar usuarios por institución
SELECT 'CONTEO POR INSTITUCIÓN:' as mensaje;
SELECT 
    i.name as institucion,
    COUNT(u.id) as total_usuarios,
    COUNT(CASE WHEN u.role = 'COORDINATOR' THEN 1 END) as coordinadores,
    COUNT(CASE WHEN u.role = 'TEACHER' THEN 1 END) as profesores,
    COUNT(CASE WHEN u.role = 'STUDENT' THEN 1 END) as estudiantes
FROM institutions i
LEFT JOIN users u ON i.id = u.institution_id AND u.is_active = true
WHERE i.is_active = true
GROUP BY i.id, i.name
ORDER BY i.name;

-- 4. Verificar usuarios específicos de prueba
SELECT 'USUARIOS DE PRUEBA ESPECÍFICOS:' as mensaje;
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.institution_id,
    i.name as institution_name
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
WHERE u.email IN (
    'coordinador@sanmartin.edu.co',
    'laura.garcia@sanmartin.edu.co',
    'sofia.martin@sanmartin.edu.co',
    'coordinador@lospinares.edu.co',
    'sandra.vargas@lospinares.edu.co',
    'lucia.flores@lospinares.edu.co'
);

-- 5. Verificar si hay usuarios sin institución
SELECT 'USUARIOS SIN INSTITUCIÓN:' as mensaje;
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.institution_id
FROM users u
WHERE u.institution_id IS NULL AND u.is_active = true;