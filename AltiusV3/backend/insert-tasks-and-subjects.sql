-- Script para insertar materias y tareas con preguntas
USE altiusv3;

-- Crear tabla de materias si no existe
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar las 10 materias
INSERT IGNORE INTO subjects (name, emoji, description) VALUES
('Lengua Castellana', '🗣️', 'Lectura, escritura y comprensión'),
('Matemáticas', '🔢', 'Operaciones básicas y lógica'),
('Ciencias Naturales', '🌱', 'Cuerpo humano, animales, plantas'),
('Ciencias Sociales', '🌍', 'Familia, comunidad, historia, geografía'),
('Inglés', '🇬🇧', 'Vocabulario y expresiones básicas'),
('Educación Artística', '🎨', 'Dibujo, música y creatividad'),
('Educación Física', '⚽', 'Juegos, deportes y hábitos saludables'),
('Ética y Valores', '❤️', 'Respeto, convivencia y empatía'),
('Tecnología e Informática', '💻', 'Uso del computador e Internet seguro'),
('Religión', '⛪', 'Valores espirituales y culturales');

-- Crear tablas de tareas si no existen
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'quiz',
    subject_name VARCHAR(255),
    institution_id BIGINT,
    teacher_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON,
    correct_answer VARCHAR(255) NOT NULL,
    points INT DEFAULT 1,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    score INT DEFAULT 0,
    answers JSON,
    submitted_at TIMESTAMP NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar 10 tareas con preguntas (usando teacher_id = 1 y institution_id = 1)
INSERT INTO tasks (title, description, subject_name, institution_id, teacher_id, created_at) VALUES
('Comprensión Lectora Básica', 'Evaluación de comprensión de textos simples', 'Lengua Castellana', 1, 1, '2024-01-15 10:00:00'),
('Operaciones Matemáticas', 'Suma, resta y multiplicación básica', 'Matemáticas', 1, 1, '2024-01-16 11:00:00'),
('El Cuerpo Humano', 'Partes del cuerpo y sus funciones', 'Ciencias Naturales', 1, 1, '2024-01-17 09:00:00'),
('Mi Familia y Comunidad', 'Roles familiares y sociales', 'Ciencias Sociales', 1, 1, '2024-01-18 14:00:00'),
('Colors and Numbers', 'Colores y números en inglés', 'Inglés', 1, 1, '2024-01-19 15:00:00'),
('Formas y Colores', 'Identificación de formas geométricas', 'Educación Artística', 1, 1, '2024-01-20 08:00:00'),
('Deportes y Salud', 'Importancia del ejercicio', 'Educación Física', 1, 1, '2024-01-21 16:00:00'),
('Valores de Convivencia', 'Respeto y amistad', 'Ética y Valores', 1, 1, '2024-01-22 13:00:00'),
('Uso Seguro del Computador', 'Reglas básicas de tecnología', 'Tecnología e Informática', 1, 1, '2024-01-23 10:30:00'),
('Valores y Tradiciones', 'Respeto por las diferencias', 'Religión', 1, 1, '2024-01-24 12:00:00');

-- Insertar preguntas para cada tarea
-- Tarea 1: Lengua Castellana
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(1, '¿Cuál es la idea principal del cuento "Los Tres Cerditos"?', '["La importancia del trabajo duro", "Los cerditos son bonitos", "El lobo es malo", "Las casas son importantes"]', 'La importancia del trabajo duro', 2),
(1, '¿Qué significa la palabra "valiente"?', '["Tener miedo", "Ser cobarde", "No tener miedo", "Estar triste"]', 'No tener miedo', 1),
(1, '¿Cuántas sílabas tiene la palabra "mariposa"?', '["2", "3", "4", "5"]', '4', 1);

-- Tarea 2: Matemáticas
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(2, '¿Cuánto es 5 + 3?', '["6", "7", "8", "9"]', '8', 1),
(2, '¿Cuánto es 12 - 4?', '["6", "7", "8", "9"]', '8', 1),
(2, 'Si tengo 3 manzanas y compro 5 más, ¿cuántas tengo en total?', '["6", "7", "8", "9"]', '8', 2);

-- Tarea 3: Ciencias Naturales
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(3, '¿Con qué parte del cuerpo vemos?', '["Oídos", "Ojos", "Nariz", "Boca"]', 'Ojos', 1),
(3, '¿Cuántos dedos tenemos en cada mano?', '["4", "5", "6", "10"]', '5', 1),
(3, '¿Qué necesitan las plantas para crecer?', '["Solo agua", "Solo sol", "Agua y sol", "Solo tierra"]', 'Agua y sol', 2);

-- Tarea 4: Ciencias Sociales
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(4, '¿Quién es el papá de tu papá?', '["Tío", "Abuelo", "Hermano", "Primo"]', 'Abuelo', 1),
(4, '¿Dónde vives?', '["En la escuela", "En el parque", "En mi casa", "En la tienda"]', 'En mi casa', 1),
(4, '¿Quién ayuda cuando estamos enfermos?', '["El doctor", "El cocinero", "El piloto", "El cantante"]', 'El doctor', 1);

-- Tarea 5: Inglés
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(5, 'How do you say "rojo" in English?', '["Blue", "Red", "Green", "Yellow"]', 'Red', 1),
(5, 'How do you say "cinco" in English?', '["Four", "Five", "Six", "Seven"]', 'Five', 1),
(5, 'What color is the sun?', '["Blue", "Red", "Green", "Yellow"]', 'Yellow', 1);

-- Tarea 6: Educación Artística
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(6, '¿Cuántos lados tiene un triángulo?', '["2", "3", "4", "5"]', '3', 1),
(6, '¿Qué colores mezclamos para hacer verde?', '["Rojo y azul", "Azul y amarillo", "Rojo y amarillo", "Negro y blanco"]', 'Azul y amarillo', 2),
(6, '¿Con qué dibujamos?', '["Cuchara", "Lápiz", "Tenedor", "Zapato"]', 'Lápiz', 1);

-- Tarea 7: Educación Física
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(7, '¿Qué deporte se juega con los pies?', '["Baloncesto", "Fútbol", "Tenis", "Natación"]', 'Fútbol', 1),
(7, '¿Qué debemos hacer antes de hacer ejercicio?', '["Comer mucho", "Calentamiento", "Dormir", "Ver TV"]', 'Calentamiento', 2),
(7, '¿Cuántas veces debemos hacer ejercicio?', '["Nunca", "Solo los domingos", "Todos los días", "Una vez al año"]', 'Todos los días', 1);

-- Tarea 8: Ética y Valores
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(8, '¿Qué debemos decir cuando alguien nos ayuda?', '["Nada", "Gracias", "Adiós", "Hola"]', 'Gracias', 1),
(8, '¿Cómo debemos tratar a nuestros amigos?', '["Con respeto", "Con gritos", "Ignorándolos", "Con golpes"]', 'Con respeto', 2),
(8, '¿Qué hacemos cuando nos equivocamos?', '["Culpar a otros", "Pedir perdón", "Escondernos", "Llorar"]', 'Pedir perdón', 1);

-- Tarea 9: Tecnología e Informática
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(9, '¿Con qué encendemos el computador?', '["Botón de encendido", "Pantalla", "Teclado", "Mouse"]', 'Botón de encendido', 1),
(9, '¿Qué NO debemos compartir en internet?', '["Fotos de mascotas", "Información personal", "Dibujos", "Canciones"]', 'Información personal', 2),
(9, '¿Para qué sirve el mouse?', '["Para escribir", "Para hacer clic", "Para escuchar", "Para ver"]', 'Para hacer clic', 1);

-- Tarea 10: Religión
INSERT INTO questions (task_id, question_text, options, correct_answer, points) VALUES
(10, '¿Qué significa "amar al prójimo"?', '["Odiar a otros", "Ayudar a otros", "Ignorar a otros", "Competir con otros"]', 'Ayudar a otros', 2),
(10, '¿Cuándo debemos ser agradecidos?', '["Nunca", "Solo en navidad", "Siempre", "Solo los domingos"]', 'Siempre', 1),
(10, '¿Qué debemos hacer con las personas diferentes a nosotros?', '["Respetarlas", "Burlarnos", "Ignorarlas", "Criticarlas"]', 'Respetarlas', 2);

-- Verificar que todo se insertó correctamente
SELECT 'Materias insertadas:' as mensaje;
SELECT COUNT(*) as total_materias FROM subjects;

SELECT 'Tareas insertadas:' as mensaje;
SELECT COUNT(*) as total_tareas FROM tasks;

SELECT 'Preguntas insertadas:' as mensaje;
SELECT COUNT(*) as total_preguntas FROM questions;

SELECT 'Resumen por materia:' as mensaje;
SELECT subject_name, COUNT(*) as tareas_por_materia FROM tasks GROUP BY subject_name;

SELECT '¡Datos de prueba insertados exitosamente!' AS resultado;