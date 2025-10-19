# Script de configuración con los datos correctos
Write-Host "🔧 CONFIGURACIÓN CORRECTA - ALTIUSV3" -ForegroundColor Green

# Configuración correcta
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

Write-Host "📋 Configuración detectada:" -ForegroundColor Cyan
Write-Host "  Base de datos: $dbName" -ForegroundColor White
Write-Host "  Usuario: $dbUser" -ForegroundColor White
Write-Host "  Puerto: $dbPort" -ForegroundColor White

Write-Host "`n🏛️ Insertando instituciones en altiusv3..." -ForegroundColor Yellow

try {
    # Crear las instituciones usando comandos SQL directos
    $sqlCommands = @"
USE altiusv3;

CREATE TABLE IF NOT EXISTS institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO institutions (name, address, phone, email, is_active) VALUES
('Colegio Central', 'Calle 123 #45-67, Centro', '3001234567', 'info@colegiocentral.edu.co', true),
('Instituto Saber', 'Carrera 45 #10-20, Norte', '3101111111', 'contacto@institutosaber.edu.co', true),
('Escuela Nueva Esperanza', 'Avenida 5 No. 8-30, Sur', '3122222222', 'admin@nuevaesperanza.edu.co', true),
('Colegio San José', 'Calle 67 #23-45, Chapinero', '3133333333', 'secretaria@sanjose.edu.co', true),
('Instituto Técnico Industrial', 'Carrera 30 #50-80, Zona Industrial', '3144444444', 'info@tecnicoindustrial.edu.co', true),
('Escuela Bilingüe Internacional', 'Calle 85 #15-30, Zona Rosa', '3155555555', 'admissions@bilingue.edu.co', true),
('Colegio Santa María', 'Avenida 68 #40-25, Engativá', '3166666666', 'info@santamaria.edu.co', true),
('Instituto de Ciencias Aplicadas', 'Carrera 7 #32-18, Centro', '3177777777', 'contacto@cienciasaplicadas.edu.co', true),
('Escuela Rural El Progreso', 'Vereda El Progreso, Km 15', '3188888888', 'direccion@elprogreso.edu.co', true),
('Colegio Moderno', 'Calle 100 #20-50, Zona Norte', '3199999999', 'info@colegiomoderno.edu.co', true),
('Instituto Pedagógico Nacional', 'Carrera 15 #75-40, Chapinero', '3200000000', 'secretaria@pedagogico.edu.co', true),
('Escuela de Artes y Oficios', 'Calle 26 #68-35, Teusaquillo', '3211111111', 'info@artesyoficios.edu.co', true),
('Colegio Campestre Los Nogales', 'Km 20 Vía La Calera', '3222222222', 'admisiones@losnogales.edu.co', true),
('Instituto Comercial', 'Avenida Jiménez #12-45, Centro', '3233333333', 'contacto@comercial.edu.co', true),
('Escuela Deportiva', 'Calle 63 #45-20, Zona Deportiva', '3244444444', 'info@deportiva.edu.co', true),
('Colegio La Salle', 'Carrera 5 #56-78, La Candelaria', '3255555555', 'secretaria@lasalle.edu.co', true),
('Instituto de Idiomas', 'Calle 93 #30-15, Zona Rosa', '3266666666', 'info@idiomas.edu.co', true),
('Escuela Técnica Agropecuaria', 'Vereda San Antonio, Km 25', '3277777777', 'direccion@agropecuaria.edu.co', true),
('Colegio Mixto Bolivariano', 'Avenida Boyacá #80-45, Fontibón', '3288888888', 'info@bolivariano.edu.co', true),
('Instituto Superior de Tecnología', 'Carrera 50 #25-60, Zona Industrial', '3299999999', 'contacto@tecnologia.edu.co', true);

SELECT COUNT(*) as total_instituciones FROM institutions WHERE is_active = true;
"@

    # Guardar comandos en archivo temporal
    $tempFile = "temp_institutions.sql"
    $sqlCommands | Out-File -FilePath $tempFile -Encoding UTF8
    
    # Ejecutar con mysql
    $mysqlCmd = "mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword < $tempFile"
    Invoke-Expression $mysqlCmd
    
    # Limpiar archivo temporal
    Remove-Item $tempFile -ErrorAction SilentlyContinue
    
    Write-Host "✅ Instituciones insertadas en altiusv3" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Ejecuta manualmente en MySQL:" -ForegroundColor Yellow
    Write-Host "   USE altiusv3;" -ForegroundColor Gray
    Write-Host "   -- Luego ejecuta el contenido de insert-institutions-direct.sql" -ForegroundColor Gray
}

Write-Host "`n🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Iniciar backend: mvn spring-boot:run" -ForegroundColor White
Write-Host "2. Iniciar frontend: npm run dev" -ForegroundColor White
Write-Host "3. Probar en: http://localhost:3001/register" -ForegroundColor White

Write-Host "`n🎉 Configuración completada con datos correctos!" -ForegroundColor Green