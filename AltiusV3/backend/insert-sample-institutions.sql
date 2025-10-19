-- Script para insertar 20 instituciones ficticias de ejemplo
-- Ejecutar este script después de crear la tabla institutions

USE altius_academy;

-- Insertar 20 instituciones ficticias con datos realistas
INSERT INTO institutions (name, address, phone, email, is_active, created_at, updated_at) VALUES
('Colegio Central', 'Calle 123 #45-67, Centro', '3001234567', 'info@colegiocentral.edu.co', true, NOW(), NOW()),
('Instituto Saber', 'Carrera 45 #10-20, Norte', '3101111111', 'contacto@institutosaber.edu.co', true, NOW(), NOW()),
('Escuela Nueva Esperanza', 'Avenida 5 No. 8-30, Sur', '3122222222', 'admin@nuevaesperanza.edu.co', true, NOW(), NOW()),
('Colegio San José', 'Calle 67 #23-45, Chapinero', '3133333333', 'secretaria@sanjose.edu.co', true, NOW(), NOW()),
('Instituto Técnico Industrial', 'Carrera 30 #50-80, Zona Industrial', '3144444444', 'info@tecnicoindustrial.edu.co', true, NOW(), NOW()),
('Escuela Bilingüe Internacional', 'Calle 85 #15-30, Zona Rosa', '3155555555', 'admissions@bilingue.edu.co', true, NOW(), NOW()),
('Colegio Santa María', 'Avenida 68 #40-25, Engativá', '3166666666', 'info@santamaria.edu.co', true, NOW(), NOW()),
('Instituto de Ciencias Aplicadas', 'Carrera 7 #32-18, Centro', '3177777777', 'contacto@cienciasaplicadas.edu.co', true, NOW(), NOW()),
('Escuela Rural El Progreso', 'Vereda El Progreso, Km 15', '3188888888', 'direccion@elprogreso.edu.co', true, NOW(), NOW()),
('Colegio Moderno', 'Calle 100 #20-50, Zona Norte', '3199999999', 'info@colegiomoderno.edu.co', true, NOW(), NOW()),
('Instituto Pedagógico Nacional', 'Carrera 15 #75-40, Chapinero', '3200000000', 'secretaria@pedagogico.edu.co', true, NOW(), NOW()),
('Escuela de Artes y Oficios', 'Calle 26 #68-35, Teusaquillo', '3211111111', 'info@artesyoficios.edu.co', true, NOW(), NOW()),
('Colegio Campestre Los Nogales', 'Km 20 Vía La Calera', '3222222222', 'admisiones@losnogales.edu.co', true, NOW(), NOW()),
('Instituto Comercial', 'Avenida Jiménez #12-45, Centro', '3233333333', 'contacto@comercial.edu.co', true, NOW(), NOW()),
('Escuela Deportiva', 'Calle 63 #45-20, Zona Deportiva', '3244444444', 'info@deportiva.edu.co', true, NOW(), NOW()),
('Colegio La Salle', 'Carrera 5 #56-78, La Candelaria', '3255555555', 'secretaria@lasalle.edu.co', true, NOW(), NOW()),
('Instituto de Idiomas', 'Calle 93 #30-15, Zona Rosa', '3266666666', 'info@idiomas.edu.co', true, NOW(), NOW()),
('Escuela Técnica Agropecuaria', 'Vereda San Antonio, Km 25', '3277777777', 'direccion@agropecuaria.edu.co', true, NOW(), NOW()),
('Colegio Mixto Bolivariano', 'Avenida Boyacá #80-45, Fontibón', '3288888888', 'info@bolivariano.edu.co', true, NOW(), NOW()),
('Instituto Superior de Tecnología', 'Carrera 50 #25-60, Zona Industrial', '3299999999', 'contacto@tecnologia.edu.co', true, NOW(), NOW());

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_instituciones FROM institutions;
SELECT name, address, phone FROM institutions ORDER BY name;

SELECT 'Se insertaron 20 instituciones ficticias exitosamente' AS mensaje;