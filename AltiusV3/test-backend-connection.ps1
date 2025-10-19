# Script para verificar la conexión al backend
Write-Host "🔍 Verificando conexión al backend..." -ForegroundColor Yellow

# Verificar si el backend está corriendo
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8090/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend está corriendo correctamente" -ForegroundColor Green
    Write-Host "Respuesta: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend no está corriendo o no responde" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    Write-Host "`n🔧 Intentando iniciar el backend..." -ForegroundColor Yellow
    
    # Cambiar al directorio del backend
    Set-Location "backend"
    
    # Verificar si Maven está instalado
    try {
        $mvnVersion = mvn -version
        Write-Host "✅ Maven encontrado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Maven no está instalado o no está en el PATH" -ForegroundColor Red
        Write-Host "Por favor instala Maven desde: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
        exit 1
    }
    
    # Verificar si MySQL está corriendo
    try {
        $mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
        if ($mysqlProcess) {
            Write-Host "✅ MySQL está corriendo" -ForegroundColor Green
        } else {
            Write-Host "❌ MySQL no está corriendo" -ForegroundColor Red
            Write-Host "Por favor inicia MySQL Server" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️ No se pudo verificar el estado de MySQL" -ForegroundColor Yellow
    }
    
    # Intentar compilar y ejecutar el backend
    Write-Host "`n🔨 Compilando el backend..." -ForegroundColor Yellow
    try {
        mvn clean compile
        Write-Host "✅ Compilación exitosa" -ForegroundColor Green
        
        Write-Host "`n🚀 Iniciando el backend..." -ForegroundColor Yellow
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -NoNewWindow
        
        Write-Host "⏳ Esperando que el backend inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Verificar nuevamente
        $response = Invoke-RestMethod -Uri "http://localhost:8090/api/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Backend iniciado correctamente" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error al compilar o iniciar el backend" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Set-Location ".."
}

Write-Host "`n🔍 Verificando endpoints críticos..." -ForegroundColor Yellow

# Verificar endpoint de login
try {
    $loginData = @{
        email = "test@altius.com"
        password = "123456"
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/login" -Method POST -Body $loginData -Headers $headers -TimeoutSec 5
    Write-Host "✅ Endpoint de login funciona correctamente" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Endpoint de login no funciona" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 Resumen de verificación completado" -ForegroundColor Cyan