-- Script para insertar 50 profesores y 50 estudiantes ficticios
USE altiusv3;

-- Insertar 50 profesores ficticios
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
-- Profesores (1-50)
('Ana', 'García', 'ana.garcia@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Carlos', 'Rodríguez', 'carlos.rodriguez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('María', 'López', 'maria.lopez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('José', 'Martínez', 'jose.martinez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Laura', 'Hernández', 'laura.hernandez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Diego', 'González', 'diego.gonzalez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Carmen', 'Pérez', 'carmen.perez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Roberto', 'Sánchez', 'roberto.sanchez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Patricia', 'Ramírez', 'patricia.ramirez@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Fernando', 'Torres', 'fernando.torres@profesor.edu.co', '$2a$10$example', 'TEACHER', 1, true, NOW()),
('Claudia', 'Flores', 'claudia.flores@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Andrés', 'Rivera', 'andres.rivera@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Mónica', 'Gómez', 'monica.gomez@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Ricardo', 'Díaz', 'ricardo.diaz@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Sandra', 'Vargas', 'sandra.vargas@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Miguel', 'Castro', 'miguel.castro@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Elena', 'Ortiz', 'elena.ortiz@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Javier', 'Morales', 'javier.morales@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Beatriz', 'Jiménez', 'beatriz.jimenez@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Alejandro', 'Ruiz', 'alejandro.ruiz@profesor.edu.co', '$2a$10$example', 'TEACHER', 2, true, NOW()),
('Gabriela', 'Mendoza', 'gabriela.mendoza@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Sergio', 'Aguilar', 'sergio.aguilar@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Valeria', 'Herrera', 'valeria.herrera@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Raúl', 'Medina', 'raul.medina@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Natalia', 'Romero', 'natalia.romero@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Óscar', 'Guerrero', 'oscar.guerrero@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Liliana', 'Muñoz', 'liliana.munoz@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Iván', 'Ramos', 'ivan.ramos@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Paola', 'Vega', 'paola.vega@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Gustavo', 'Silva', 'gustavo.silva@profesor.edu.co', '$2a$10$example', 'TEACHER', 3, true, NOW()),
('Adriana', 'Paredes', 'adriana.paredes@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Mauricio', 'Campos', 'mauricio.campos@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Rocío', 'Navarro', 'rocio.navarro@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Esteban', 'Cortés', 'esteban.cortes@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Mariana', 'Reyes', 'mariana.reyes@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Nicolás', 'Peña', 'nicolas.pena@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Cristina', 'Lara', 'cristina.lara@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Fabián', 'Moreno', 'fabian.moreno@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Lorena', 'Delgado', 'lorena.delgado@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Camilo', 'Rojas', 'camilo.rojas@profesor.edu.co', '$2a$10$example', 'TEACHER', 4, true, NOW()),
('Ingrid', 'Salazar', 'ingrid.salazar@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Álvaro', 'Carrillo', 'alvaro.carrillo@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Yolanda', 'Espinoza', 'yolanda.espinoza@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Rubén', 'Figueroa', 'ruben.figueroa@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Pilar', 'Cabrera', 'pilar.cabrera@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Emilio', 'Valdez', 'emilio.valdez@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Silvia', 'Maldonado', 'silvia.maldonado@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Arturo', 'Pacheco', 'arturo.pacheco@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Verónica', 'Ibarra', 'veronica.ibarra@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW()),
('Héctor', 'Sandoval', 'hector.sandoval@profesor.edu.co', '$2a$10$example', 'TEACHER', 5, true, NOW());

-- Insertar 50 estudiantes ficticios
INSERT IGNORE INTO users (first_name, last_name, email, password, role, institution_id, is_active, created_at) VALUES
-- Estudiantes (51-100)
('Sofía', 'Martín', 'sofia.martin@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Mateo', 'García', 'mateo.garcia@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Valentina', 'López', 'valentina.lopez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Santiago', 'Rodríguez', 'santiago.rodriguez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Isabella', 'Hernández', 'isabella.hernandez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Sebastián', 'González', 'sebastian.gonzalez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Camila', 'Pérez', 'camila.perez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Nicolás', 'Sánchez', 'nicolas.sanchez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Mariana', 'Ramírez', 'mariana.ramirez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Alejandro', 'Torres', 'alejandro.torres@estudiante.edu.co', '$2a$10$example', 'STUDENT', 1, true, NOW()),
('Lucía', 'Flores', 'lucia.flores@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Daniel', 'Rivera', 'daniel.rivera@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Antonella', 'Gómez', 'antonella.gomez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Emiliano', 'Díaz', 'emiliano.diaz@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Renata', 'Vargas', 'renata.vargas@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Joaquín', 'Castro', 'joaquin.castro@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Valeria', 'Ortiz', 'valeria.ortiz@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Maximiliano', 'Morales', 'maximiliano.morales@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Julieta', 'Jiménez', 'julieta.jimenez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Benjamín', 'Ruiz', 'benjamin.ruiz@estudiante.edu.co', '$2a$10$example', 'STUDENT', 2, true, NOW()),
('Amelia', 'Mendoza', 'amelia.mendoza@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Thiago', 'Aguilar', 'thiago.aguilar@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Emma', 'Herrera', 'emma.herrera@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Leonardo', 'Medina', 'leonardo.medina@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Olivia', 'Romero', 'olivia.romero@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Gael', 'Guerrero', 'gael.guerrero@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Mía', 'Muñoz', 'mia.munoz@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Ian', 'Ramos', 'ian.ramos@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Zoe', 'Vega', 'zoe.vega@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Liam', 'Silva', 'liam.silva@estudiante.edu.co', '$2a$10$example', 'STUDENT', 3, true, NOW()),
('Delfina', 'Paredes', 'delfina.paredes@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Bautista', 'Campos', 'bautista.campos@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Catalina', 'Navarro', 'catalina.navarro@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Tomás', 'Cortés', 'tomas.cortes@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Alma', 'Reyes', 'alma.reyes@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Bruno', 'Peña', 'bruno.pena@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Abril', 'Lara', 'abril.lara@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Enzo', 'Moreno', 'enzo.moreno@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Bianca', 'Delgado', 'bianca.delgado@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Dante', 'Rojas', 'dante.rojas@estudiante.edu.co', '$2a$10$example', 'STUDENT', 4, true, NOW()),
('Constanza', 'Salazar', 'constanza.salazar@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Agustín', 'Carrillo', 'agustin.carrillo@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Esperanza', 'Espinoza', 'esperanza.espinoza@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Patricio', 'Figueroa', 'patricio.figueroa@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Fernanda', 'Cabrera', 'fernanda.cabrera@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Ignacio', 'Valdez', 'ignacio.valdez@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Guadalupe', 'Maldonado', 'guadalupe.maldonado@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Rodrigo', 'Pacheco', 'rodrigo.pacheco@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Paloma', 'Ibarra', 'paloma.ibarra@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW()),
('Facundo', 'Sandoval', 'facundo.sandoval@estudiante.edu.co', '$2a$10$example', 'STUDENT', 5, true, NOW());

-- Verificar inserción
SELECT 'Profesores insertados:' as mensaje;
SELECT COUNT(*) as total_profesores FROM users WHERE role = 'TEACHER';

SELECT 'Estudiantes insertados:' as mensaje;
SELECT COUNT(*) as total_estudiantes FROM users WHERE role = 'STUDENT';

SELECT 'Distribución por institución:' as mensaje;
SELECT institution_id, role, COUNT(*) as cantidad 
FROM users 
WHERE role IN ('TEACHER', 'STUDENT') 
GROUP BY institution_id, role 
ORDER BY institution_id, role;

SELECT '¡100 usuarios ficticios insertados exitosamente!' AS resultado;