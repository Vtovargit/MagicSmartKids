package com.altiusacademy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    private Path fileStorageLocation;
    
    public void init() {
        try {
            this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento.", ex);
        }
    }
    
    public String storeFile(MultipartFile file, String subFolder) {
        if (fileStorageLocation == null) {
            init();
        }
        
        // Validar archivo
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Validar nombre de archivo
            if (originalFilename.contains("..")) {
                throw new RuntimeException("El nombre del archivo contiene una secuencia de ruta no válida: " + originalFilename);
            }
            
            // Validar extensión
            String extension = getFileExtension(originalFilename);
            if (!isValidExtension(extension)) {
                throw new RuntimeException("Tipo de archivo no permitido: " + extension);
            }
            
            // Validar tamaño (10MB máximo)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new RuntimeException("El archivo excede el tamaño máximo permitido de 10MB");
            }
            
            // Generar nombre único
            String fileName = UUID.randomUUID().toString() + "_" + originalFilename;
            
            // Crear subdirectorio si no existe
            Path targetLocation = fileStorageLocation.resolve(subFolder);
            Files.createDirectories(targetLocation);
            
            // Copiar archivo
            Path filePath = targetLocation.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Retornar ruta relativa
            return subFolder + "/" + fileName;
            
        } catch (IOException ex) {
            log.error("Error almacenando archivo: {}", ex.getMessage());
            throw new RuntimeException("No se pudo almacenar el archivo " + originalFilename, ex);
        }
    }
    
    public void deleteFile(String filePath) {
        try {
            if (fileStorageLocation == null) {
                init();
            }
            
            Path file = fileStorageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            log.error("Error eliminando archivo: {}", ex.getMessage());
        }
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
    
    private boolean isValidExtension(String extension) {
        return extension.equals("jpg") || 
               extension.equals("jpeg") || 
               extension.equals("png") || 
               extension.equals("pdf") || 
               extension.equals("docx") || 
               extension.equals("doc");
    }
}
