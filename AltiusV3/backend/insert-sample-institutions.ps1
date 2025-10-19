# Script para insertar 20 instituciones ficticias en la base de datos
# Ejecutar desde la carpeta backend: .\insert-sample-institutions.ps1

Write-Host "🏛️ Insertando instituciones ficticias..." -ForegroundColor Green

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
    Write-Host "📝 Insertando 20 instituciones ficticias..." -ForegroundColor Yellow
    
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < insert-sample-institutions.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Instituciones insertadas exitosamente" -ForegroundColor Green
        Write-Host "📋 Se han agregado 20 instituciones ficticias" -ForegroundColor Green
        
        # Verificar el resultado
        Write-Host "🔍 Verificando instituciones insertadas..." -ForegroundColor Yellow
        $verifyQuery = "SELECT COUNT(*) as total FROM institutions WHERE is_active = true;"
        $result = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "$verifyQuery" -s -N
        
        Write-Host "📊 Total de instituciones activas: $result" -ForegroundColor Cyan
        
    } else {
        Write-Host "❌ Error insertando instituciones" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error ejecutando el script: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Proceso completado" -ForegroundColor Green
Write-Host "💡 Ahora puedes usar el registro con las instituciones disponibles" -ForegroundColor Cyan