# Script completo para configurar el sistema multi-institución
# Ejecutar desde la carpeta backend: .\setup-complete-system.ps1

Write-Host "🚀 Configurando sistema completo multi-institución..." -ForegroundColor Green

# Configuración de la base de datos
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altius_academy"
$dbUser = "root"
$dbPassword = "admin123"

Write-Host "📋 Pasos a ejecutar:" -ForegroundColor Cyan
Write-Host "  1. Crear tabla user_institution_roles" -ForegroundColor White
Write-Host "  2. Insertar 20 instituciones ficticias" -ForegroundColor White
Write-Host "  3. Verificar configuración" -ForegroundColor White
Write-Host ""

# Paso 1: Crear tabla user_institution_roles
Write-Host "🔧 Paso 1: Creando tabla user_institution_roles..." -ForegroundColor Yellow

try {
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < create-user-institution-roles-table.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tabla user_institution_roles creada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error creando tabla user_institution_roles" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error en paso 1: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Paso 2: Insertar instituciones ficticias
Write-Host "🏛️ Paso 2: Insertando 20 instituciones ficticias..." -ForegroundColor Yellow

try {
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < insert-sample-institutions.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Instituciones ficticias insertadas exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error insertando instituciones" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error en paso 2: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Paso 3: Verificar configuración
Write-Host "🔍 Paso 3: Verificando configuración..." -ForegroundColor Yellow

try {
    # Verificar tabla user_institution_roles
    $tableCheck = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SHOW TABLES LIKE 'user_institution_roles';" -s -N
    
    if ($tableCheck -eq "user_institution_roles") {
        Write-Host "✅ Tabla user_institution_roles existe" -ForegroundColor Green
    } else {
        Write-Host "❌ Tabla user_institution_roles no encontrada" -ForegroundColor Red
        exit 1
    }
    
    # Verificar instituciones
    $institutionCount = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM institutions WHERE is_active = true;" -s -N
    
    Write-Host "📊 Instituciones activas encontradas: $institutionCount" -ForegroundColor Cyan
    
    if ([int]$institutionCount -ge 20) {
        Write-Host "✅ Instituciones configuradas correctamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Se esperaban al menos 20 instituciones, encontradas: $institutionCount" -ForegroundColor Yellow
    }
    
    # Mostrar algunas instituciones de ejemplo
    Write-Host "🏫 Primeras 5 instituciones:" -ForegroundColor Cyan
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT id, name, address FROM institutions WHERE is_active = true ORDER BY name LIMIT 5;"
    
} catch {
    Write-Host "❌ Error en verificación: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Sistema configurado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Resumen de configuración:" -ForegroundColor Cyan
Write-Host "  ✅ Tabla user_institution_roles creada" -ForegroundColor White
Write-Host "  ✅ $institutionCount instituciones disponibles" -ForegroundColor White
Write-Host "  ✅ Sistema multi-institución listo" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Iniciar el backend: .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  2. Iniciar el frontend: npm run dev" -ForegroundColor White
Write-Host "  3. Probar el registro en: http://localhost:5173/register" -ForegroundColor White
Write-Host ""
Write-Host "💡 Funcionalidades disponibles:" -ForegroundColor Cyan
Write-Host "  • Registro con selección de institución" -ForegroundColor White
Write-Host "  • Crear nuevas instituciones desde el formulario" -ForegroundColor White
Write-Host "  • Gestión de estudiantes por institución" -ForegroundColor White
Write-Host "  • Sistema multi-institución completo" -ForegroundColor White