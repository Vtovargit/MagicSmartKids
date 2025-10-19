-- Inicializar grados académicos de primaria
-- Este script crea los grados 1° a 5° si no existen

INSERT IGNORE INTO academic_grades (name, description, level, is_active, created_at, updated_at) VALUES
('1°', 'Primer Grado', 1, true, NOW(), NOW()),
('2°', 'Segundo Grado', 2, true, NOW(), NOW()),
('3°', 'Tercer Grado', 3, true, NOW(), NOW()),
('4°', 'Cuarto Grado', 4, true, NOW(), NOW()),
('5°', 'Quinto Grado', 5, true, NOW(), NOW());

-- Verificar que se crearon correctamente
SELECT * FROM academic_grades ORDER BY level;