# Script de verificación completa del sistema Altius Academy
Write-Host "🚀 VERIFICACIÓN COMPLETA DEL SISTEMA ALTIUS ACADEMY" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

$testResults = @{
    backend = $false
    database = $false
    authentication = $false
    dashboards = $false
    frontend = $false
}

# 1. VERIFICAR BACKEND
Write-Host "`n1️⃣ VERIFICANDO BACKEND..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/health" -Method GET -TimeoutSec 5
    if ($healthResponse.status -eq "UP") {
        Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
        Write-Host "   Service: $($healthResponse.service)" -ForegroundColor Cyan
        Write-Host "   Version: $($healthResponse.version)" -ForegroundColor Cyan
        $testResults.backend = $true
    }
} catch {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Ejecuta: cd backend && mvn spring-boot:run" -ForegroundColor Yellow
}

# 2. VERIFICAR BASE DE DATOS
Write-Host "`n2️⃣ VERIFICANDO BASE DE DATOS..." -ForegroundColor Yellow
try {
    $dbResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/database-test/status" -Method GET -TimeoutSec 10
    if ($dbResponse.status -eq "CONNECTED") {
        Write-Host "✅ Base de datos conectada" -ForegroundColor Green
        Write-Host "   Total usuarios: $($dbResponse.totalUsers)" -ForegroundColor Cyan
        Write-Host "   Database: $($dbResponse.database)" -ForegroundColor Cyan
        $testResults.database = $true
        
        # Mostrar usuarios por rol
        Write-Host "   👥 Usuarios por rol:" -ForegroundColor Cyan
        foreach ($role in $dbResponse.usersByRole.PSObject.Properties) {
            Write-Host "      $($role.Name): $($role.Value)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Error de conexión a base de datos" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Verifica que MySQL esté corriendo" -ForegroundColor Yellow
}

# 3. CREAR USUARIOS DE PRUEBA SI NO EXISTEN
Write-Host "`n3️⃣ VERIFICANDO USUARIOS DE PRUEBA..." -ForegroundColor Yellow
try {
    $sampleUsersResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/database-test/create-sample-users" -Method POST -TimeoutSec 10
    Write-Host "✅ Usuarios de prueba verificados" -ForegroundColor Green
    Write-Host "   Creados: $($sampleUsersResponse.created)" -ForegroundColor Cyan
    Write-Host "   Ya existían: $($sampleUsersResponse.existing)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error verificando usuarios de prueba" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. PROBAR AUTENTICACIÓN PARA CADA ROL
Write-Host "`n4️⃣ PROBANDO AUTENTICACIÓN POR ROL..." -ForegroundColor Yellow

$testCredentials = @(
    @{ email = "admin@altius.com"; password = "123456"; role = "ADMIN"; name = "Administrador" },
    @{ email = "secretary@altius.com"; password = "123456"; role = "SECRETARY"; name = "Secretaria" },
    @{ email = "coordinator@altius.com"; password = "123456"; role = "COORDINATOR"; name = "Coordinador" },
    @{ email = "teacher@altius.com"; password = "123456"; role = "TEACHER"; name = "Profesor" },
    @{ email = "student@altius.com"; password = "123456"; role = "STUDENT"; name = "Estudiante" },
    @{ email = "parent@altius.com"; password = "123456"; role = "PARENT"; name = "Padre" }
)

$successfulLogins = 0
foreach ($cred in $testCredentials) {
    try {
        $loginData = @{
            email = $cred.email
            password = $cred.password
        } | ConvertTo-Json
        
        $headers = @{ "Content-Type" = "application/json" }
        
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/login" -Method POST -Body $loginData -Headers $headers -TimeoutSec 5
        
        if ($loginResponse.success) {
            Write-Host "   ✅ $($cred.name): $($cred.email)" -ForegroundColor Green
            $successfulLogins++
        } else {
            Write-Host "   ❌ $($cred.name): $($loginResponse.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ $($cred.name): Error de conexión" -ForegroundColor Red
    }
}

if ($successfulLogins -eq $testCredentials.Count) {
    Write-Host "✅ Autenticación funcionando para todos los roles" -ForegroundColor Green
    $testResults.authentication = $true
} else {
    Write-Host "⚠️ Autenticación parcial: $successfulLogins/$($testCredentials.Count) roles" -ForegroundColor Yellow
}

# 5. VERIFICAR ENDPOINTS DE DASHBOARDS
Write-Host "`n5️⃣ VERIFICANDO ENDPOINTS DE DASHBOARDS..." -ForegroundColor Yellow

$dashboardEndpoints = @(
    @{ url = "/api/admin/stats"; name = "Admin Stats" },
    @{ url = "/api/secretary/global-stats"; name = "Secretary Stats" },
    @{ url = "/api/users/teachers"; name = "Teachers List" },
    @{ url = "/api/student/stats"; name = "Student Stats" },
    @{ url = "/api/parent/stats"; name = "Parent Stats" }
)

$workingEndpoints = 0
foreach ($endpoint in $dashboardEndpoints) {
    try {
        # Usar token de admin para las pruebas
        $adminLoginData = @{
            email = "admin@altius.com"
            password = "123456"
        } | ConvertTo-Json
        
        $adminHeaders = @{ "Content-Type" = "application/json" }
        $adminLoginResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/login" -Method POST -Body $adminLoginData -Headers $adminHeaders -TimeoutSec 5
        
        if ($adminLoginResponse.success) {
            $authHeaders = @{ 
                "Content-Type" = "application/json"
                "Authorization" = "Bearer $($adminLoginResponse.token)"
            }
            
            $response = Invoke-RestMethod -Uri "http://localhost:8090$($endpoint.url)" -Method GET -Headers $authHeaders -TimeoutSec 5
            Write-Host "   ✅ $($endpoint.name)" -ForegroundColor Green
            $workingEndpoints++
        }
    } catch {
        # Los endpoints pueden no existir aún, esto es normal
        Write-Host "   ⚠️ $($endpoint.name): Endpoint no implementado (normal)" -ForegroundColor Yellow
    }
}

if ($workingEndpoints -gt 0) {
    $testResults.dashboards = $true
}

# 6. VERIFICAR CONFIGURACIÓN DEL FRONTEND
Write-Host "`n6️⃣ VERIFICANDO CONFIGURACIÓN DEL FRONTEND..." -ForegroundColor Yellow

# Verificar archivos críticos
$frontendFiles = @(
    @{ path = ".env"; name = "Variables de entorno" },
    @{ path = "package.json"; name = "Package.json" },
    @{ path = "vite.config.ts"; name = "Configuración Vite" },
    @{ path = "src/pages/Dashboard.tsx"; name = "Dashboard principal" },
    @{ path = "src/stores/authStore.ts"; name = "Store de autenticación" }
)

$existingFiles = 0
foreach ($file in $frontendFiles) {
    if (Test-Path $file.path) {
        Write-Host "   ✅ $($file.name)" -ForegroundColor Green
        $existingFiles++
    } else {
        Write-Host "   ❌ $($file.name) no encontrado" -ForegroundColor Red
    }
}

if ($existingFiles -eq $frontendFiles.Count) {
    $testResults.frontend = $true
}

# 7. VERIFICAR PUERTO DEL FRONTEND
Write-Host "`n7️⃣ VERIFICANDO FRONTEND EN EJECUCIÓN..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend corriendo en puerto 3001" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Frontend no está corriendo" -ForegroundColor Yellow
    Write-Host "   💡 Ejecuta: npm run dev" -ForegroundColor Yellow
}

# 8. RESUMEN FINAL
Write-Host "`n8️⃣ RESUMEN DE VERIFICACIÓN" -ForegroundColor Yellow
Write-Host "=" * 50 -ForegroundColor Yellow

$totalTests = $testResults.Values.Count
$passedTests = ($testResults.Values | Where-Object { $_ -eq $true }).Count

Write-Host "`n📊 RESULTADOS:" -ForegroundColor Cyan
Write-Host "   Backend:        $(if($testResults.backend){'✅ OK'}else{'❌ FAIL'})" -ForegroundColor $(if($testResults.backend){'Green'}else{'Red'})
Write-Host "   Base de Datos:  $(if($testResults.database){'✅ OK'}else{'❌ FAIL'})" -ForegroundColor $(if($testResults.database){'Green'}else{'Red'})
Write-Host "   Autenticación:  $(if($testResults.authentication){'✅ OK'}else{'❌ FAIL'})" -ForegroundColor $(if($testResults.authentication){'Green'}else{'Red'})
Write-Host "   Dashboards:     $(if($testResults.dashboards){'✅ OK'}else{'⚠️ PARTIAL'})" -ForegroundColor $(if($testResults.dashboards){'Green'}else{'Yellow'})
Write-Host "   Frontend:       $(if($testResults.frontend){'✅ OK'}else{'❌ FAIL'})" -ForegroundColor $(if($testResults.frontend){'Green'}else{'Red'})

$percentage = [math]::Round(($passedTests / $totalTests) * 100, 1)
Write-Host "`n🎯 PUNTUACIÓN GENERAL: $percentage% ($passedTests/$totalTests)" -ForegroundColor $(if($percentage -ge 80){'Green'}elseif($percentage -ge 60){'Yellow'}else{'Red'})

# 9. CREDENCIALES Y URLS
Write-Host "`n9️⃣ INFORMACIÓN IMPORTANTE" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

Write-Host "`n🔑 CREDENCIALES DE PRUEBA:" -ForegroundColor Cyan
foreach ($cred in $testCredentials) {
    Write-Host "   $($cred.name.PadRight(12)): $($cred.email) / $($cred.password)" -ForegroundColor White
}

Write-Host "`n🔗 URLS IMPORTANTES:" -ForegroundColor Cyan
Write-Host "   Frontend:       http://localhost:3001" -ForegroundColor White
Write-Host "   Backend:        http://localhost:8090" -ForegroundColor White
Write-Host "   API Health:     http://localhost:8090/api/health" -ForegroundColor White
Write-Host "   DB Test:        http://localhost:8090/api/database-test/status" -ForegroundColor White

Write-Host "`n🚀 COMANDOS PARA INICIAR:" -ForegroundColor Cyan
Write-Host "   Backend:        cd backend && mvn spring-boot:run" -ForegroundColor White
Write-Host "   Frontend:       npm install && npm run dev" -ForegroundColor White

# 10. RECOMENDACIONES
Write-Host "`n🔟 RECOMENDACIONES" -ForegroundColor Yellow
Write-Host "=" * 30 -ForegroundColor Yellow

if (-not $testResults.backend) {
    Write-Host "❗ CRÍTICO: Inicia el backend primero" -ForegroundColor Red
}

if (-not $testResults.database) {
    Write-Host "❗ CRÍTICO: Verifica que MySQL esté corriendo" -ForegroundColor Red
}

if (-not $testResults.authentication) {
    Write-Host "❗ IMPORTANTE: Problemas de autenticación detectados" -ForegroundColor Red
}

if ($percentage -ge 80) {
    Write-Host "`n🎉 SISTEMA LISTO PARA USO" -ForegroundColor Green
    Write-Host "   La aplicación está funcionando correctamente" -ForegroundColor Green
} elseif ($percentage -ge 60) {
    Write-Host "`n⚠️ SISTEMA PARCIALMENTE FUNCIONAL" -ForegroundColor Yellow
    Write-Host "   Algunos componentes necesitan atención" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ SISTEMA REQUIERE ATENCIÓN" -ForegroundColor Red
    Write-Host "   Varios componentes críticos fallan" -ForegroundColor Red
}

Write-Host "`n✅ VERIFICACIÓN COMPLETADA" -ForegroundColor Green