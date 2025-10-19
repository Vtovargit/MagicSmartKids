# Script para ejecutar la migración de user_institution_roles
# Ejecutar desde la carpeta backend: .\migrate-user-institution-roles.ps1

Write-Host "🔧 Iniciando migración de user_institution_roles..." -ForegroundColor Green

# Configuración de la base de datos
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altius_academy"
$dbUser = "root"
$dbPassword = "admin123"

# Verificar que MySQL esté disponible
Write-Host "📡 Verificando conexión a MySQL..." -ForegroundColor Yellow

try {
    # Ejecutar el script SQL
    Write-Host "📝 Ejecutando script de migración..." -ForegroundColor Yellow
    
    $mysqlCommand = "mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword -e `"source create-user-institution-roles-table.sql`""
    
    # Alternativa usando el archivo directamente
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < create-user-institution-roles-table.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migración completada exitosamente" -ForegroundColor Green
        Write-Host "📋 La tabla user_institution_roles ha sido creada" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en la migración" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error ejecutando la migración: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Proceso completado" -ForegroundColor Green