-- Agregar columna para múltiples archivos en entregas de tareas
ALTER TABLE task_submissions 
ADD COLUMN submission_files TEXT COMMENT 'JSON array con múltiples archivos: ["file1.pdf", "file2.jpg"]';

-- Migrar datos existentes: convertir submission_file_url a formato JSON
UPDATE task_submissions 
SET submission_files = CONCAT('["', submission_file_url, '"]')
WHERE submission_file_url IS NOT NULL AND submission_file_url != '';
