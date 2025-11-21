-- Script para eliminar estudiantes duplicados en Cuarto C
-- Mantener solo los estudiantes con emails tipo "estudiante1.cuartoc@colegio.edu"
-- y eliminar los que tienen emails tipo "carlos.ramirez@colegio.edu"

USE AltiusV3;

-- Deshabilitar safe mode temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Ver los duplicados antes de eliminar
SELECT u.id, u.first_name, u.last_name, u.email, sg.grade_name
FROM users u
JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE sg.grade_name = 'Cuarto C'
AND u.role = 'STUDENT'
ORDER BY u.first_name, u.last_name;

-- Obtener los IDs de estudiantes a eliminar
SELECT u.id
FROM users u
JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE sg.grade_name = 'Cuarto C'
AND u.role = 'STUDENT'
AND u.email NOT LIKE '%cuartoc@colegio.edu';

-- PASO 1: Eliminar task_submissions de estos estudiantes
DELETE FROM task_submissions
WHERE student_id IN (
    SELECT u.id
    FROM users u
    JOIN school_grades sg ON u.school_grade_id = sg.id
    WHERE sg.grade_name = 'Cuarto C'
    AND u.role = 'STUDENT'
    AND u.email NOT LIKE '%cuartoc@colegio.edu'
);

-- PASO 2: Eliminar activity_results
DELETE FROM activity_results
WHERE user_id IN (
    SELECT u.id
    FROM users u
    JOIN school_grades sg ON u.school_grade_id = sg.id
    WHERE sg.grade_name = 'Cuarto C'
    AND u.role = 'STUDENT'
    AND u.email NOT LIKE '%cuartoc@colegio.edu'
);

-- PASO 3: Eliminar grades
DELETE FROM grades
WHERE student_id IN (
    SELECT u.id
    FROM users u
    JOIN school_grades sg ON u.school_grade_id = sg.id
    WHERE sg.grade_name = 'Cuarto C'
    AND u.role = 'STUDENT'
    AND u.email NOT LIKE '%cuartoc@colegio.edu'
);

-- PASO 4: Eliminar submissions
DELETE FROM submissions
WHERE student_id IN (
    SELECT u.id
    FROM users u
    JOIN school_grades sg ON u.school_grade_id = sg.id
    WHERE sg.grade_name = 'Cuarto C'
    AND u.role = 'STUDENT'
    AND u.email NOT LIKE '%cuartoc@colegio.edu'
);

-- PASO 5: Eliminar attendance
DELETE FROM attendance
WHERE student_id IN (
    SELECT u.id
    FROM users u
    JOIN school_grades sg ON u.school_grade_id = sg.id
    WHERE sg.grade_name = 'Cuarto C'
    AND u.role = 'STUDENT'
    AND u.email NOT LIKE '%cuartoc@colegio.edu'
);

-- PASO 6: Ahora sí, eliminar los estudiantes duplicados de Cuarto C
DELETE FROM users
WHERE id IN (
    SELECT id FROM (
        SELECT u.id
        FROM users u
        JOIN school_grades sg ON u.school_grade_id = sg.id
        WHERE sg.grade_name = 'Cuarto C'
        AND u.role = 'STUDENT'
        AND u.email NOT LIKE '%cuartoc@colegio.edu'
    ) AS temp
);

-- Reactivar safe mode
SET SQL_SAFE_UPDATES = 1;

-- Verificar que solo quedan los estudiantes correctos
SELECT u.id, u.first_name, u.last_name, u.email, sg.grade_name
FROM users u
JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE sg.grade_name = 'Cuarto C'
AND u.role = 'STUDENT'
ORDER BY u.first_name, u.last_name;
