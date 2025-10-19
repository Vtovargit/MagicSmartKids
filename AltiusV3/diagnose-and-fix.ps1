# Script completo para diagnosticar y solucionar problemas de conexión
Write-Host "🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA ALTIUS ACADEMY" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# 1. VERIFICAR BACKEND
Write-Host "`n1️⃣ VERIFICANDO BACKEND..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend está corriendo" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor Cyan
    Write-Host "   Service: $($healthResponse.service)" -ForegroundColor Cyan
    Write-Host "   Version: $($healthResponse.version)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    Write-Host "`n🔧 INICIANDO BACKEND..." -ForegroundColor Yellow
    Set-Location "backend"
    
    # Verificar Java
    try {
        $javaVersion = java -version 2>&1 | Select-String "version"
        Write-Host "✅ Java encontrado: $javaVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Java no encontrado. Instala Java 17 o superior" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
    
    # Verificar Maven
    try {
        $mvnVersion = mvn -version 2>&1 | Select-String "Apache Maven"
        Write-Host "✅ Maven encontrado: $mvnVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Maven no encontrado. Instala Maven" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
    
    # Compilar y ejecutar
    Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
    mvn clean compile -q
    
    Write-Host "🚀 Iniciando backend en segundo plano..." -ForegroundColor Yellow
    Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -WindowStyle Hidden
    
    Write-Host "⏳ Esperando que el backend inicie (30 segundos)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Set-Location ".."
}

# 2. VERIFICAR BASE DE DATOS
Write-Host "`n2️⃣ VERIFICANDO BASE DE DATOS..." -ForegroundColor Yellow

try {
    $dbResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/database-test/status" -Method GET -TimeoutSec 10
    Write-Host "✅ Base de datos conectada" -ForegroundColor Green
    Write-Host "   Status: $($dbResponse.status)" -ForegroundColor Cyan
    Write-Host "   Total usuarios: $($dbResponse.totalUsers)" -ForegroundColor Cyan
    Write-Host "   Database: $($dbResponse.database)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error de conexión a base de datos" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    Write-Host "`n🔧 VERIFICANDO MYSQL..." -ForegroundColor Yellow
    
    # Verificar si MySQL está corriendo
    $mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
    if ($mysqlProcess) {
        Write-Host "✅ MySQL está corriendo (PID: $($mysqlProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL no está corriendo" -ForegroundColor Red
        Write-Host "   Por favor inicia MySQL Server" -ForegroundColor Yellow
        Write-Host "   - XAMPP: Inicia Apache y MySQL desde el panel de control" -ForegroundColor Yellow
        Write-Host "   - MySQL Workbench: Conecta al servidor local" -ForegroundColor Yellow
        Write-Host "   - Comando: net start mysql (como administrador)" -ForegroundColor Yellow
    }
}

# 3. CREAR USUARIOS DE PRUEBA
Write-Host "`n3️⃣ CREANDO USUARIOS DE PRUEBA..." -ForegroundColor Yellow

try {
    $sampleUsersResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/database-test/create-sample-users" -Method POST -TimeoutSec 10
    Write-Host "✅ Usuarios de prueba creados" -ForegroundColor Green
    Write-Host "   Creados: $($sampleUsersResponse.created)" -ForegroundColor Cyan
    Write-Host "   Ya existían: $($sampleUsersResponse.existing)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando usuarios de prueba" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. PROBAR AUTENTICACIÓN
Write-Host "`n4️⃣ PROBANDO AUTENTICACIÓN..." -ForegroundColor Yellow

$testCredentials = @(
    @{ email = "admin@altius.com"; password = "123456"; role = "ADMIN" },
    @{ email = "teacher@altius.com"; password = "123456"; role = "TEACHER" },
    @{ email = "student@altius.com"; password = "123456"; role = "STUDENT" }
)

foreach ($cred in $testCredentials) {
    try {
        $loginData = @{
            email = $cred.email
            password = $cred.password
        } | ConvertTo-Json
        
        $headers = @{ "Content-Type" = "application/json" }
        
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/login" -Method POST -Body $loginData -Headers $headers -TimeoutSec 5
        
        if ($loginResponse.success) {
            Write-Host "✅ Login exitoso para $($cred.role): $($cred.email)" -ForegroundColor Green
        } else {
            Write-Host "❌ Login fallido para $($cred.role): $($loginResponse.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error probando login para $($cred.role): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 5. VERIFICAR FRONTEND
Write-Host "`n5️⃣ VERIFICANDO CONFIGURACIÓN DEL FRONTEND..." -ForegroundColor Yellow

# Verificar archivo .env
if (Test-Path ".env") {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
    $envContent = Get-Content ".env"
    $apiUrl = $envContent | Where-Object { $_ -match "VITE_API_BASE_URL" }
    if ($apiUrl) {
        Write-Host "   API URL: $apiUrl" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
}

# Verificar package.json
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json no encontrado" -ForegroundColor Red
}

# 6. RESUMEN Y RECOMENDACIONES
Write-Host "`n6️⃣ RESUMEN Y RECOMENDACIONES" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

Write-Host "`n📋 CREDENCIALES DE PRUEBA:" -ForegroundColor Cyan
Write-Host "   Admin:      admin@altius.com / 123456" -ForegroundColor White
Write-Host "   Profesor:   teacher@altius.com / 123456" -ForegroundColor White
Write-Host "   Estudiante: student@altius.com / 123456" -ForegroundColor White
Write-Host "   Padre:      parent@altius.com / 123456" -ForegroundColor White

Write-Host "`n🔗 URLS IMPORTANTES:" -ForegroundColor Cyan
Write-Host "   Frontend:   http://localhost:3001" -ForegroundColor White
Write-Host "   Backend:    http://localhost:8090" -ForegroundColor White
Write-Host "   API Health: http://localhost:8090/api/health" -ForegroundColor White
Write-Host "   DB Test:    http://localhost:8090/api/database-test/status" -ForegroundColor White

Write-Host "`n🚀 PARA INICIAR EL FRONTEND:" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White

Write-Host "`n✅ DIAGNÓSTICO COMPLETADO" -ForegroundColor Green