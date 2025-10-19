# Script de inicio rápido para Altius Academy
Write-Host "🚀 INICIANDO ALTIUS ACADEMY" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Cyan

# Verificar prerrequisitos
Write-Host "`n1️⃣ VERIFICANDO PRERREQUISITOS..." -ForegroundColor Yellow

# Verificar Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java no encontrado. Instala Java 17 o superior" -ForegroundColor Red
    exit 1
}

# Verificar Maven
try {
    $mvnVersion = mvn -version 2>&1 | Select-String "Apache Maven"
    Write-Host "✅ Maven: $mvnVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven no encontrado. Instala Apache Maven" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Instala Node.js 18 o superior" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar MySQL
Write-Host "`n2️⃣ VERIFICANDO MYSQL..." -ForegroundColor Yellow
$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host "✅ MySQL está corriendo (PID: $($mysqlProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "⚠️ MySQL no está corriendo" -ForegroundColor Yellow
    Write-Host "   Por favor inicia MySQL Server antes de continuar" -ForegroundColor Yellow
    Write-Host "   - XAMPP: Inicia MySQL desde el panel de control" -ForegroundColor Yellow
    Write-Host "   - MySQL Workbench: Conecta al servidor local" -ForegroundColor Yellow
    Write-Host "   - Comando: net start mysql (como administrador)" -ForegroundColor Yellow
    
    $continue = Read-Host "`n¿Continuar sin MySQL? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Instalar dependencias del frontend si es necesario
Write-Host "`n3️⃣ VERIFICANDO DEPENDENCIAS DEL FRONTEND..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# Iniciar backend en segundo plano
Write-Host "`n4️⃣ INICIANDO BACKEND..." -ForegroundColor Yellow
Set-Location "backend"

# Compilar el backend
Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
mvn clean compile -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error compilando backend" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Iniciar backend en segundo plano
Write-Host "🚀 Iniciando backend en segundo plano..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -WindowStyle Hidden -PassThru
Write-Host "✅ Backend iniciado (PID: $($backendProcess.Id))" -ForegroundColor Green

Set-Location ".."

# Esperar que el backend inicie
Write-Host "`n5️⃣ ESPERANDO QUE EL BACKEND INICIE..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$backendReady = $false

while ($attempt -lt $maxAttempts -and -not $backendReady) {
    $attempt++
    Write-Host "   Intento $attempt/$maxAttempts..." -ForegroundColor Cyan
    
    try {
        $healthResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/health" -Method GET -TimeoutSec 2
        if ($healthResponse.status -eq "UP") {
            $backendReady = $true
            Write-Host "✅ Backend listo y funcionando" -ForegroundColor Green
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend no respondió en tiempo esperado" -ForegroundColor Red
    Write-Host "   Verifica los logs del backend manualmente" -ForegroundColor Yellow
} else {
    # Crear usuarios de prueba
    Write-Host "`n6️⃣ CREANDO USUARIOS DE PRUEBA..." -ForegroundColor Yellow
    try {
        $sampleUsersResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/database-test/create-sample-users" -Method POST -TimeoutSec 10
        Write-Host "✅ Usuarios de prueba creados" -ForegroundColor Green
        Write-Host "   Nuevos: $($sampleUsersResponse.created)" -ForegroundColor Cyan
        Write-Host "   Existentes: $($sampleUsersResponse.existing)" -ForegroundColor Cyan
    } catch {
        Write-Host "⚠️ No se pudieron crear usuarios de prueba" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Iniciar frontend
Write-Host "`n7️⃣ INICIANDO FRONTEND..." -ForegroundColor Yellow
Write-Host "🌐 Abriendo frontend en http://localhost:3001..." -ForegroundColor Yellow

# Iniciar frontend (esto abrirá automáticamente el navegador)
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow

# Mostrar información final
Write-Host "`n8️⃣ ALTIUS ACADEMY INICIADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green

Write-Host "`n🔗 URLS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3001" -ForegroundColor White
Write-Host "   Backend:     http://localhost:8090" -ForegroundColor White
Write-Host "   API Health:  http://localhost:8090/api/health" -ForegroundColor White

Write-Host "`n🔑 CREDENCIALES DE PRUEBA:" -ForegroundColor Cyan
Write-Host "   Administrador:  admin@altius.com / 123456" -ForegroundColor White
Write-Host "   Secretaria:     secretary@altius.com / 123456" -ForegroundColor White
Write-Host "   Coordinador:    coordinator@altius.com / 123456" -ForegroundColor White
Write-Host "   Profesor:       teacher@altius.com / 123456" -ForegroundColor White
Write-Host "   Estudiante:     student@altius.com / 123456" -ForegroundColor White
Write-Host "   Padre:          parent@altius.com / 123456" -ForegroundColor White

Write-Host "`n📋 PROCESOS EN EJECUCIÓN:" -ForegroundColor Cyan
Write-Host "   Backend PID:    $($backendProcess.Id)" -ForegroundColor White
Write-Host "   Frontend:       Se abrirá automáticamente" -ForegroundColor White

Write-Host "`n🛠️ COMANDOS ÚTILES:" -ForegroundColor Cyan
Write-Host "   Verificar sistema:     ./test-complete-system.ps1" -ForegroundColor White
Write-Host "   Diagnóstico completo:  ./diagnose-and-fix.ps1" -ForegroundColor White
Write-Host "   Detener backend:       taskkill /PID $($backendProcess.Id) /F" -ForegroundColor White

Write-Host "`n🎉 ¡LISTO PARA USAR ALTIUS ACADEMY!" -ForegroundColor Green
Write-Host "   El navegador se abrirá automáticamente en unos segundos..." -ForegroundColor Green

# Esperar un poco para que el frontend inicie
Start-Sleep -Seconds 3

Write-Host "`n✅ INICIO COMPLETADO" -ForegroundColor Green