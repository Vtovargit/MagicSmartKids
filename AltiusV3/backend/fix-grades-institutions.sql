-- ========================================
-- SCRIPT MAESTRO: fix-grades-institutions.sql
-- Corrige academic_grade_id, inicializa grados y asegura integridad
-- EJECUTADO: 2025-01-11 18:30:00
-- ========================================

-- OBLIGATORIO: Seleccionar base de datos
USE altiusv3;
SELECT 'Base de datos seleccionada:' as status, DATABASE() as bd_actual;

-- ========================================
-- PASO 1: CORREGIR VALORES VACÍOS ('' → NULL)
-- ========================================

-- Log de inicio
SELECT 'INICIANDO CORRECCIÓN DE VALORES VACÍOS...' as log_info, NOW() as timestamp;

-- 1) Corregir valores vacíos a NULL
UPDATE users SET academic_grade_id = NULL WHERE academic_grade_id = '';
SELECT ROW_COUNT() as academic_grade_corregidos;

UPDATE users SET institution_id = NULL WHERE institution_id = '';
SELECT ROW_COUNT() as institution_id_corregidos;

-- 2) Asegurar columnas permiten NULL
ALTER TABLE users MODIFY academic_grade_id INT NULL;
ALTER TABLE users MODIFY institution_id INT NULL;

SELECT 'Columnas modificadas para permitir NULL' as status;

-- ========================================
-- PASO 2: CREAR TABLA ACADEMIC_GRADES
-- ========================================

SELECT 'CREANDO/VERIFICANDO TABLA ACADEMIC_GRADES...' as log_info, NOW() as timestamp;

CREATE TABLE IF NOT EXISTS academic_grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200) NULL,
    level INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar grados básicos si no existen
INSERT IGNORE INTO academic_grades (name, description, level, is_active) VALUES
('1°', 'Primer Grado', 1, true),
('2°', 'Segundo Grado', 2, true),
('3°', 'Tercer Grado', 3, true),
('4°', 'Cuarto Grado', 4, true),
('5°', 'Quinto Grado', 5, true);

SELECT 'Grados académicos creados/verificados:' as status;
SELECT * FROM academic_grades ORDER BY level;

-- ========================================
-- PASO 3: GESTIONAR FOREIGN KEYS
-- ========================================

SELECT 'GESTIONANDO FOREIGN KEYS...' as log_info, NOW() as timestamp;

-- Verificar foreign keys existentes
SELECT 'Foreign keys existentes en users:' as info;
SELECT 
    CONSTRAINT_NAME as nombre_fk,
    COLUMN_NAME as columna,
    REFERENCED_TABLE_NAME as tabla_ref,
    REFERENCED_COLUMN_NAME as columna_ref
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Eliminar foreign keys existentes si hay conflictos (ignorar errores)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'users' 
     AND CONSTRAINT_NAME = 'fk_user_grade') > 0,
    'ALTER TABLE users DROP FOREIGN KEY fk_user_grade',
    'SELECT "FK fk_user_grade no existe" as info'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'users' 
     AND CONSTRAINT_NAME = 'fk_user_institution') > 0,
    'ALTER TABLE users DROP FOREIGN KEY fk_user_institution',
    'SELECT "FK fk_user_institution no existe" as info'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear foreign keys con ON DELETE SET NULL
ALTER TABLE users 
ADD CONSTRAINT fk_user_academic_grade 
FOREIGN KEY (academic_grade_id) REFERENCES academic_grades(id) ON DELETE SET NULL;

-- Solo crear FK de institution si la tabla institutions existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'institutions') > 0,
    'ALTER TABLE users ADD CONSTRAINT fk_user_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL',
    'SELECT "Tabla institutions no existe, FK no creada" as info'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Foreign keys creadas/actualizadas' as status;

-- ========================================
-- PASO 4: ASIGNAR GRADOS A USUARIOS
-- ========================================

SELECT 'ASIGNANDO GRADOS A USUARIOS...' as log_info, NOW() as timestamp;

-- Obtener IDs de grados académicos
SET @grado1 = (SELECT id FROM academic_grades WHERE name = '1°');
SET @grado2 = (SELECT id FROM academic_grades WHERE name = '2°');
SET @grado3 = (SELECT id FROM academic_grades WHERE name = '3°');
SET @grado4 = (SELECT id FROM academic_grades WHERE name = '4°');
SET @grado5 = (SELECT id FROM academic_grades WHERE name = '5°');

SELECT 'IDs de grados obtenidos:' as info;
SELECT @grado1 as '1°', @grado2 as '2°', @grado3 as '3°', @grado4 as '4°', @grado5 as '5°';

-- Asignar grados específicos usando IDs reales
UPDATE users SET academic_grade_id = @grado1 WHERE id = 1;
UPDATE users SET academic_grade_id = @grado1 WHERE id = 2;
UPDATE users SET academic_grade_id = @grado2 WHERE id = 3;
UPDATE users SET academic_grade_id = NULL WHERE id = 4; -- Profesor sin grado
UPDATE users SET academic_grade_id = @grado3 WHERE id = 5;
UPDATE users SET academic_grade_id = NULL WHERE id = 6; -- Coordinador sin grado

-- Asignar grados distribuidos a estudiantes restantes
UPDATE users SET academic_grade_id = @grado1 
WHERE role = 'STUDENT' AND academic_grade_id IS NULL AND id % 5 = 1;

UPDATE users SET academic_grade_id = @grado2 
WHERE role = 'STUDENT' AND academic_grade_id IS NULL AND id % 5 = 2;

UPDATE users SET academic_grade_id = @grado3 
WHERE role = 'STUDENT' AND academic_grade_id IS NULL AND id % 5 = 3;

UPDATE users SET academic_grade_id = @grado4 
WHERE role = 'STUDENT' AND academic_grade_id IS NULL AND id % 5 = 4;

UPDATE users SET academic_grade_id = @grado5 
WHERE role = 'STUDENT' AND academic_grade_id IS NULL AND id % 5 = 0;

-- Asegurar que profesores y coordinadores NO tengan grado
UPDATE users SET academic_grade_id = NULL 
WHERE role IN ('TEACHER', 'COORDINATOR', 'ADMIN', 'SECRETARY', 'PARENT');

SELECT 'Grados asignados a usuarios' as status;

-- ========================================
-- PASO 5: VERIFICACIONES OBLIGATORIAS
-- ========================================

SELECT 'EJECUTANDO VERIFICACIONES...' as log_info, NOW() as timestamp;

-- No debe haber cadenas vacías en estas columnas (DEBE DEVOLVER 0)
SELECT 'Verificación 1 - Valores vacíos (debe ser 0):' as verificacion;
SELECT COUNT(*) as bad_count 
FROM users 
WHERE academic_grade_id = '' OR institution_id = '';

-- Revisar cuántos usuarios tienen grado por rol
SELECT 'Verificación 2 - Usuarios por rol y grado:' as verificacion;
SELECT 
    role, 
    COUNT(*) as total, 
    COUNT(academic_grade_id) as with_grade 
FROM users 
GROUP BY role;

-- Revisar usuarios con institución NULL
SELECT 'Verificación 3 - Usuarios sin institución:' as verificacion;
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    institution_id 
FROM users 
WHERE institution_id IS NULL 
LIMIT 20;

-- Verificación detallada de estudiantes con grados
SELECT 'Verificación 4 - Estudiantes con grados asignados:' as verificacion;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.role,
    ag.name as grado,
    ag.description
FROM users u
LEFT JOIN academic_grades ag ON u.academic_grade_id = ag.id
WHERE u.role = 'STUDENT'
ORDER BY ag.level, u.first_name
LIMIT 15;

-- ========================================
-- FINALIZACIÓN
-- ========================================

SELECT 'SCRIPT COMPLETADO EXITOSAMENTE ✅' as resultado, NOW() as timestamp_final;
SELECT 'Backup recomendado antes de ejecutar este script' as nota_importante;
SELECT 'Próximo paso: Reiniciar backend y frontend' as siguiente_accion;