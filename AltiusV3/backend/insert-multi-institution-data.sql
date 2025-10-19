-- Script para crear datos ficticios del sistema multiinstitución
USE altiusv3;

-- 1. INSERTAR INSTITUCIONES FICTICIAS
INSERT IGNORE INTO institutions (name, address, phone, email, is_active, created_at, updated_at) VALUES
('Colegio San Martín', 'Calle 123 #45-67, Bogotá', '601-2345678', 'info@sanmartin.edu.co', true, NOW(), NOW()),
('Instituto Los Pinares', 'Carrera 89 #12-34, Medellín', '604-8765432', 'contacto@lospinares.edu.co', true, NOW(), NOW()),
('Escuela Nuevo Horizonte', 'Avenida 56 #78-90, Cali', '602-5551234', 'admin@nuevohorizonte.edu.co', true, NOW(), NOW()),
('Liceo Técnico Industrial', 'Diagonal 34 #56-78, Barranquilla', '605-9876543', 'secretaria@liceotecnico.edu.co', true, NOW(), NOW()),
('Colegio Bilingüe Internacional', 'Transversal 12 #34-56, Bucaramanga', '607-1112233', 'info@bilingue.edu.co', true, NOW(), NOW());

-- 2. INSERTAR USUARIOS FICTICIOS DISTRIBUIDOS POR INSTITUCIONES

-- COORDINADORES (1 por institución)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Ana María', 'Rodríguez', 'coordinador@sanmartin.edu.co', '$2a$10$example', 'COORDINATOR', 1, true, NOW()),
('Carlos Eduardo', 'Gómez', 'coordinador@lospinares.edu.co', '$2a$10$example', 'COORDINATOR', 2, true, NOW()),
('María Elena', 'Vargas', 'coordinador@nuevohorizonte.edu.co', '$2a$10$example', 'COORDINATOR', 3, true, NOW()),
('José Luis', 'Martínez', 'coordinador@liceotecnico.edu.co', '$2a$10$example', 'COORDINATOR', 4, true, NOW()),
('Patricia', 'Hernández', 'coordinador@bilingue.edu.co', '$2a$10$example', 'COORDINATOR', 5, true, NOW());

-- PROFESORES (10 por institución = 50 total)
-- Colegio San Martín (ID: 1)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Laura', 'García', 'laura.garcia@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Diego', 'López', 'diego.lopez@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Carmen', 'Pérez', 'carmen.perez@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Roberto', 'Sánchez', 'roberto.sanchez@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Patricia', 'Ramírez', 'patricia.ramirez@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Fernando', 'Torres', 'fernando.torres@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Claudia', 'Flores', 'claudia.flores@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Andrés', 'Rivera', 'andres.rivera@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Mónica', 'Gómez', 'monica.gomez@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Ricardo', 'Díaz', 'ricardo.diaz@sanmartin.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW());

-- Instituto Los Pinares (ID: 2)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Sandra', 'Vargas', 'sandra.vargas@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Miguel', 'Castro', 'miguel.castro@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Elena', 'Ortiz', 'elena.ortiz@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Javier', 'Morales', 'javier.morales@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Beatriz', 'Jiménez', 'beatriz.jimenez@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Alejandro', 'Ruiz', 'alejandro.ruiz@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Gabriela', 'Mendoza', 'gabriela.mendoza@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Sergio', 'Aguilar', 'sergio.aguilar@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Valeria', 'Herrera', 'valeria.herrera@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Raúl', 'Medina', 'raul.medina@lospinares.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW());

-- Escuela Nuevo Horizonte (ID: 3)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Natalia', 'Romero', 'natalia.romero@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Óscar', 'Guerrero', 'oscar.guerrero@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Liliana', 'Muñoz', 'liliana.munoz@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Iván', 'Ramos', 'ivan.ramos@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Paola', 'Vega', 'paola.vega@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Gustavo', 'Silva', 'gustavo.silva@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Adriana', 'Paredes', 'adriana.paredes@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Mauricio', 'Campos', 'mauricio.campos@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Rocío', 'Navarro', 'rocio.navarro@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Esteban', 'Cortés', 'esteban.cortes@nuevohorizonte.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW());

-- Liceo Técnico Industrial (ID: 4)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Mariana', 'Reyes', 'mariana.reyes@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Nicolás', 'Peña', 'nicolas.pena@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Cristina', 'Lara', 'cristina.lara@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Fabián', 'Moreno', 'fabian.moreno@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Lorena', 'Delgado', 'lorena.delgado@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Camilo', 'Rojas', 'camilo.rojas@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Ingrid', 'Salazar', 'ingrid.salazar@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Álvaro', 'Carrillo', 'alvaro.carrillo@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Yolanda', 'Espinoza', 'yolanda.espinoza@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Rubén', 'Figueroa', 'ruben.figueroa@liceotecnico.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW());

-- Colegio Bilingüe Internacional (ID: 5)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Pilar', 'Cabrera', 'pilar.cabrera@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Emilio', 'Valdez', 'emilio.valdez@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Silvia', 'Maldonado', 'silvia.maldonado@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Arturo', 'Pacheco', 'arturo.pacheco@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Verónica', 'Ibarra', 'veronica.ibarra@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Héctor', 'Sandoval', 'hector.sandoval@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Lucía', 'Mendez', 'lucia.mendez@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Gonzalo', 'Vásquez', 'gonzalo.vasquez@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Esperanza', 'Morales', 'esperanza.morales@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Rodrigo', 'Castillo', 'rodrigo.castillo@bilingue.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW());

-- ESTUDIANTES (10 por institución = 50 total)
-- Colegio San Martín (ID: 1)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Sofía', 'Martín', 'sofia.martin@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Mateo', 'García', 'mateo.garcia@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Valentina', 'López', 'valentina.lopez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Santiago', 'Rodríguez', 'santiago.rodriguez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Isabella', 'Hernández', 'isabella.hernandez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Sebastián', 'González', 'sebastian.gonzalez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Camila', 'Pérez', 'camila.perez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Nicolás', 'Sánchez', 'nicolas.sanchez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Mariana', 'Ramírez', 'mariana.ramirez@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Alejandro', 'Torres', 'alejandro.torres@sanmartin.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW());

-- Instituto Los Pinares (ID: 2)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Lucía', 'Flores', 'lucia.flores@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Daniel', 'Rivera', 'daniel.rivera@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Antonella', 'Gómez', 'antonella.gomez@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Emiliano', 'Díaz', 'emiliano.diaz@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Renata', 'Vargas', 'renata.vargas@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Joaquín', 'Castro', 'joaquin.castro@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Valeria', 'Ortiz', 'valeria.ortiz@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Maximiliano', 'Morales', 'maximiliano.morales@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Julieta', 'Jiménez', 'julieta.jimenez@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Benjamín', 'Ruiz', 'benjamin.ruiz@lospinares.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW());

-- Escuela Nuevo Horizonte (ID: 3)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Amelia', 'Mendoza', 'amelia.mendoza@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Thiago', 'Aguilar', 'thiago.aguilar@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Emma', 'Herrera', 'emma.herrera@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Leonardo', 'Medina', 'leonardo.medina@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Olivia', 'Romero', 'olivia.romero@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Gael', 'Guerrero', 'gael.guerrero@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Mía', 'Muñoz', 'mia.munoz@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Ian', 'Ramos', 'ian.ramos@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Zoe', 'Vega', 'zoe.vega@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Liam', 'Silva', 'liam.silva@nuevohorizonte.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW());

-- Liceo Técnico Industrial (ID: 4)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Delfina', 'Paredes', 'delfina.paredes@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Bautista', 'Campos', 'bautista.campos@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Catalina', 'Navarro', 'catalina.navarro@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Tomás', 'Cortés', 'tomas.cortes@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Alma', 'Reyes', 'alma.reyes@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Bruno', 'Peña', 'bruno.pena@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Abril', 'Lara', 'abril.lara@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Enzo', 'Moreno', 'enzo.moreno@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Bianca', 'Delgado', 'bianca.delgado@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Dante', 'Rojas', 'dante.rojas@liceotecnico.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW());

-- Colegio Bilingüe Internacional (ID: 5)
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
('Constanza', 'Salazar', 'constanza.salazar@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Agustín', 'Carrillo', 'agustin.carrillo@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Esperanza', 'Espinoza', 'esperanza.espinoza@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Patricio', 'Figueroa', 'patricio.figueroa@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Fernanda', 'Cabrera', 'fernanda.cabrera@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Ignacio', 'Valdez', 'ignacio.valdez@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Guadalupe', 'Maldonado', 'guadalupe.maldonado@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Rodrigo', 'Pacheco', 'rodrigo.pacheco@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Paloma', 'Ibarra', 'paloma.ibarra@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Facundo', 'Sandoval', 'facundo.sandoval@bilingue.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW());

-- 3. CREAR MATERIAS POR INSTITUCIÓN
INSERT IGNORE INTO subjects (name, description, teacher_id, institution_id, is_active, created_at, updated_at) VALUES
-- Colegio San Martín
('📚 Matemáticas', 'Álgebra y Geometría', (SELECT id FROM users WHERE email = 'laura.garcia@sanmartin.edu.co'), 1, true, NOW(), NOW()),
('📖 Lengua Castellana', 'Literatura y Gramática', (SELECT id FROM users WHERE email = 'diego.lopez@sanmartin.edu.co'), 1, true, NOW(), NOW()),
('🔬 Ciencias Naturales', 'Biología y Química', (SELECT id FROM users WHERE email = 'carmen.perez@sanmartin.edu.co'), 1, true, NOW(), NOW()),
('🌍 Ciencias Sociales', 'Historia y Geografía', (SELECT id FROM users WHERE email = 'roberto.sanchez@sanmartin.edu.co'), 1, true, NOW(), NOW()),

-- Instituto Los Pinares
('📊 Matemáticas Avanzadas', 'Cálculo y Estadística', (SELECT id FROM users WHERE email = 'sandra.vargas@lospinares.edu.co'), 2, true, NOW(), NOW()),
('🇬🇧 Inglés', 'Conversación y Gramática', (SELECT id FROM users WHERE email = 'miguel.castro@lospinares.edu.co'), 2, true, NOW(), NOW()),
('💻 Informática', 'Programación y Sistemas', (SELECT id FROM users WHERE email = 'elena.ortiz@lospinares.edu.co'), 2, true, NOW(), NOW()),
('🎨 Educación Artística', 'Dibujo y Pintura', (SELECT id FROM users WHERE email = 'javier.morales@lospinares.edu.co'), 2, true, NOW(), NOW()),

-- Escuela Nuevo Horizonte
('🧮 Aritmética', 'Operaciones Básicas', (SELECT id FROM users WHERE email = 'natalia.romero@nuevohorizonte.edu.co'), 3, true, NOW(), NOW()),
('📝 Lectoescritura', 'Comprensión Lectora', (SELECT id FROM users WHERE email = 'oscar.guerrero@nuevohorizonte.edu.co'), 3, true, NOW(), NOW()),
('🌱 Ciencias Naturales', 'Medio Ambiente', (SELECT id FROM users WHERE email = 'liliana.munoz@nuevohorizonte.edu.co'), 3, true, NOW(), NOW()),
('⚽ Educación Física', 'Deportes y Recreación', (SELECT id FROM users WHERE email = 'ivan.ramos@nuevohorizonte.edu.co'), 3, true, NOW(), NOW());

-- Verificación final
SELECT 'RESUMEN DE DATOS INSERTADOS:' as mensaje;

SELECT 'Instituciones:' as tipo, COUNT(*) as total FROM institutions WHERE is_active = true
UNION ALL
SELECT 'Coordinadores:', COUNT(*) FROM users WHERE role = 'COORDINATOR' AND is_active = true
UNION ALL
SELECT 'Profesores:', COUNT(*) FROM users WHERE role = 'TEACHER' AND is_active = true
UNION ALL
SELECT 'Estudiantes:', COUNT(*) FROM users WHERE role = 'STUDENT' AND is_active = true
UNION ALL
SELECT 'Materias:', COUNT(*) FROM subjects WHERE is_active = true;

SELECT 'DISTRIBUCIÓN POR INSTITUCIÓN:' as mensaje;
SELECT 
    i.name as institucion,
    COUNT(CASE WHEN u.role = 'COORDINATOR' THEN 1 END) as coordinadores,
    COUNT(CASE WHEN u.role = 'TEACHER' THEN 1 END) as profesores,
    COUNT(CASE WHEN u.role = 'STUDENT' THEN 1 END) as estudiantes,
    COUNT(*) as total_usuarios
FROM institutions i
LEFT JOIN users u ON i.id = u.institution_id AND u.is_active = true
WHERE i.is_active = true
GROUP BY i.id, i.name
ORDER BY i.name;

SELECT '¡SISTEMA MULTIINSTITUCIÓN CONFIGURADO EXITOSAMENTE!' AS resultado;