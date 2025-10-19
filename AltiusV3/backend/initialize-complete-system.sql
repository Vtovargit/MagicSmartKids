-- ========================================
-- INICIALIZACIÓN COMPLETA DEL SISTEMA
-- Ejecutar este script para configurar todo el sistema
-- ========================================

USE altiusv3;

-- 1. Ejecutar corrección de grados académicos
source fix-grades-institutions.sql;

-- 2. Crear tablas de actividades
source create-activities-tables.sql;

-- 3. Crear actividad de ejemplo para pruebas
INSERT INTO activities (
    title, 
    description, 
    type, 
    content, 
    teacher_id, 
    institution_id, 
    academic_grade_id, 
    max_score, 
    time_limit_minutes
) VALUES (
    'Matemáticas Básicas - Suma y Resta',
    'Actividad interactiva para practicar operaciones básicas de suma y resta',
    'exam',
    '{"questions": [
        {
            "id": 1,
            "text": "¿Cuánto es 5 + 3?",
            "type": "multiple-choice",
            "options": ["6", "7", "8", "9"],
            "correctAnswer": "8",
            "points": 10
        },
        {
            "id": 2,
            "text": "¿Cuánto es 10 - 4?",
            "type": "multiple-choice",
            "options": ["5", "6", "7", "8"],
            "correctAnswer": "6",
            "points": 10
        },
        {
            "id": 3,
            "text": "¿Cuánto es 2 + 2?",
            "type": "multiple-choice",
            "options": ["3", "4", "5", "6"],
            "correctAnswer": "4",
            "points": 10
        }
    ]}',
    (SELECT id FROM users WHERE role = 'TEACHER' LIMIT 1),
    (SELECT id FROM institutions LIMIT 1),
    (SELECT id FROM academic_grades WHERE name = '1°'),
    30,
    15
);

-- 4. Verificación final
SELECT 'SISTEMA INICIALIZADO COMPLETAMENTE ✅' as resultado;

SELECT 'Grados académicos:' as info;
SELECT * FROM academic_grades ORDER BY level;

SELECT 'Actividades de ejemplo:' as info;
SELECT 
    a.id,
    a.title,
    a.type,
    u.first_name as profesor,
    i.name as institucion,
    ag.name as grado
FROM activities a
LEFT JOIN users u ON a.teacher_id = u.id
LEFT JOIN institutions i ON a.institution_id = i.id
LEFT JOIN academic_grades ag ON a.academic_grade_id = ag.id;

SELECT 'Usuarios con grados asignados:' as info;
SELECT 
    role,
    COUNT(*) as total,
    COUNT(academic_grade_id) as con_grado
FROM users 
GROUP BY role;