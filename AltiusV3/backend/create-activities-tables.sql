-- ========================================
-- CREAR TABLAS PARA SISTEMA DE ACTIVIDADES INTERACTIVAS
-- Ejecutar después de fix-grades-institutions.sql
-- ========================================

USE altiusv3;

-- Crear tabla de actividades
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'exam',
    content JSON,
    teacher_id BIGINT NOT NULL,
    institution_id BIGINT NOT NULL,
    academic_grade_id BIGINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_score INT DEFAULT 100,
    time_limit_minutes INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_grade_id) REFERENCES academic_grades(id) ON DELETE SET NULL
);

-- Crear tabla de resultados de actividades
CREATE TABLE IF NOT EXISTS activity_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    score INT DEFAULT 0,
    max_score INT DEFAULT 100,
    answers JSON,
    time_spent_minutes INT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_activity (user_id, activity_id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_activities_institution ON activities(institution_id);
CREATE INDEX idx_activities_teacher ON activities(teacher_id);
CREATE INDEX idx_activities_grade ON activities(academic_grade_id);
CREATE INDEX idx_activity_results_user ON activity_results(user_id);
CREATE INDEX idx_activity_results_activity ON activity_results(activity_id);

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas de actividades creadas:' as status;
SHOW TABLES LIKE '%activit%';

-- Verificar estructura
SELECT 'Estructura de tabla activities:' as info;
DESCRIBE activities;

SELECT 'Estructura de tabla activity_results:' as info;
DESCRIBE activity_results;

SELECT 'TABLAS DE ACTIVIDADES CREADAS EXITOSAMENTE ✅' as resultado;