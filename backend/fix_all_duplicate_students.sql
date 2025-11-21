-- Script para eliminar TODOS los estudiantes duplicados
-- Este script elimina estudiantes que tienen el mismo nombre y apellido
-- pero diferentes emails, manteniendo solo uno por cada combinación de nombre/apellido/grado

USE AltiusV3;

-- Deshabilitar safe mode temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Ver todos los estudiantes duplicados antes de eliminar
SELECT 
    u.id, 
    u.first_name, 
    u.last_name, 
    u.email, 
    sg.grade_name
FROM users u
JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE u.role = 'STUDENT'
AND (u.first_name, u.last_name, u.school_grade_id) IN (
    SELECT first_name, last_name, school_grade_id
    FROM users
    WHERE role = 'STUDENT'
    GROUP BY first_name, last_name, school_grade_id
    HAVING COUNT(*) > 1
)
ORDER BY sg.grade_name, u.first_name, u.last_name, u.id;

-- PASO 1: Eliminar task_submissions de estudiantes duplicados (los que tienen ID mayor)
DELETE FROM task_submissions
WHERE student_id IN (
    SELECT u1.id
    FROM users u1
    INNER JOIN users u2 ON u1.first_name = u2.first_name 
        AND u1.last_name = u2.last_name 
        AND u1.school_grade_id = u2.school_grade_id
        AND u1.role = 'STUDENT'
        AND u2.role = 'STUDENT'
        AND u1.id > u2.id
);

-- PASO 2: Eliminar activity_results de estudiantes duplicados
DELETE FROM activity_results
WHERE user_id IN (
    SELECT u1.id
    FROM users u1
    INNER JOIN users u2 ON u1.first_name = u2.first_name 
        AND u1.last_name = u2.last_name 
        AND u1.school_grade_id = u2.school_grade_id
        AND u1.role = 'STUDENT'
        AND u2.role = 'STUDENT'
        AND u1.id > u2.id
);

-- PASO 3: Eliminar grades de estudiantes duplicados
DELETE FROM grades
WHERE student_id IN (
    SELECT u1.id
    FROM users u1
    INNER JOIN users u2 ON u1.first_name = u2.first_name 
        AND u1.last_name = u2.last_name 
        AND u1.school_grade_id = u2.school_grade_id
        AND u1.role = 'STUDENT'
        AND u2.role = 'STUDENT'
        AND u1.id > u2.id
);

-- PASO 4: Eliminar submissions de estudiantes duplicados
DELETE FROM submissions
WHERE student_id IN (
    SELECT u1.id
    FROM users u1
    INNER JOIN users u2 ON u1.first_name = u2.first_name 
        AND u1.last_name = u2.last_name 
        AND u1.school_grade_id = u2.school_grade_id
        AND u1.role = 'STUDENT'
        AND u2.role = 'STUDENT'
        AND u1.id > u2.id
);

-- PASO 5: Eliminar attendance de estudiantes duplicados
DELETE FROM attendance
WHERE student_id IN (
    SELECT u1.id
    FROM users u1
    INNER JOIN users u2 ON u1.first_name = u2.first_name 
        AND u1.last_name = u2.last_name 
        AND u1.school_grade_id = u2.school_grade_id
        AND u1.role = 'STUDENT'
        AND u2.role = 'STUDENT'
        AND u1.id > u2.id
);

-- PASO 6: Ahora sí, eliminar los estudiantes duplicados
-- Mantiene solo el estudiante con el ID más bajo (el más antiguo)
DELETE u1 FROM users u1
INNER JOIN users u2 ON u1.first_name = u2.first_name 
    AND u1.last_name = u2.last_name 
    AND u1.school_grade_id = u2.school_grade_id
    AND u1.role = 'STUDENT'
    AND u2.role = 'STUDENT'
    AND u1.id > u2.id;

-- Reactivar safe mode
SET SQL_SAFE_UPDATES = 1;

-- Verificar que no quedan duplicados
SELECT 
    u.first_name, 
    u.last_name, 
    sg.grade_name,
    COUNT(*) as count
FROM users u
JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE u.role = 'STUDENT'
GROUP BY u.first_name, u.last_name, sg.grade_name
HAVING count > 1;

-- Si el resultado anterior está vacío, los duplicados fueron eliminados correctamente
-- Mostrar resumen de estudiantes por grado
SELECT 
    sg.grade_name,
    COUNT(*) as total_students
FROM users u
JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE u.role = 'STUDENT'
GROUP BY sg.grade_name
ORDER BY sg.grade_name;
