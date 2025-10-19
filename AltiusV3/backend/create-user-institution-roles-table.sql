-- Script para crear la tabla user_institution_roles
-- Ejecutar este script en MySQL para crear la nueva tabla

USE altius_academy;

-- Crear tabla user_institution_roles
CREATE TABLE IF NOT EXISTS user_institution_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    institution_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    
    -- Índice único para evitar duplicados
    UNIQUE KEY unique_user_institution_role (user_id, institution_id, role)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_user_institution_roles_user_id ON user_institution_roles(user_id);
CREATE INDEX idx_user_institution_roles_institution_id ON user_institution_roles(institution_id);
CREATE INDEX idx_user_institution_roles_role ON user_institution_roles(role);
CREATE INDEX idx_user_institution_roles_active ON user_institution_roles(active);

-- Verificar que la tabla se creó correctamente
DESCRIBE user_institution_roles;

-- Mostrar las tablas existentes
SHOW TABLES;

SELECT 'Tabla user_institution_roles creada exitosamente' AS mensaje;