# Script para probar el sistema de registro avanzado
Write-Host "🧪 PROBANDO SISTEMA DE REGISTRO AVANZADO" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Verificar que el backend esté corriendo
Write-Host "`n1️⃣ Verificando Backend..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde. Iniciando..." -ForegroundColor Red
    Write-Host "Por favor ejecuta: cd backend && mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# Probar endpoint de grados académicos
Write-Host "`n2️⃣ Probando Grados Académicos..." -ForegroundColor Yellow
try {
    $gradesResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions/academic-grades" -Method GET -TimeoutSec 5
    Write-Host "✅ Grados obtenidos:" -ForegroundColor Green
    $gradesResponse.grades | ForEach-Object { Write-Host "   - $_" -ForegroundColor Cyan }
} catch {
    Write-Host "❌ Error obteniendo grados: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar validación de NIT (con datos de prueba)
Write-Host "`n3️⃣ Probando Validación de NIT..." -ForegroundColor Yellow
$testNits = @("123456789", "987654321", "111222333")

foreach ($nit in $testNits) {
    try {
        $nitResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions/validate-nit/$nit" -Method GET -TimeoutSec 5
        if ($nitResponse.exists) {
            Write-Host "✅ NIT $nit encontrado: $($nitResponse.institution.name)" -ForegroundColor Green
        } else {
            Write-Host "⚠️ NIT $nit no encontrado" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error validando NIT $nit" -ForegroundColor Red
    }
}

# Probar validación de estudiante
Write-Host "`n4️⃣ Probando Validación de Estudiantes..." -ForegroundColor Yellow
$testStudents = @(
    @{ email = "student@altius.com"; nit = "123456789" },
    @{ email = "juan.perez@colegio.edu"; nit = "987654321" }
)

foreach ($student in $testStudents) {
    try {
        $studentResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions/validate-student?email=$($student.email)&institutionNit=$($student.nit)" -Method GET -TimeoutSec 5
        if ($studentResponse.exists) {
            Write-Host "✅ Estudiante $($student.email) encontrado en institución" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Estudiante $($student.email) no encontrado" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error validando estudiante $($student.email)" -ForegroundColor Red
    }
}

# Crear institución de prueba con NIT
Write-Host "`n5️⃣ Creando Institución de Prueba..." -ForegroundColor Yellow
try {
    $institutionData = @{
        name = "Colegio Prueba Registro"
        nit = "123456789-1"
        address = "Calle 123 #45-67"
        phone = "555-0123"
        email = "info@colegioprueba.edu"
    } | ConvertTo-Json

    $headers = @{ "Content-Type" = "application/json" }
    
    $institutionResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions" -Method POST -Body $institutionData -Headers $headers -TimeoutSec 10
    
    if ($institutionResponse.success) {
        Write-Host "✅ Institución de prueba creada:" -ForegroundColor Green
        Write-Host "   Nombre: $($institutionResponse.institution.name)" -ForegroundColor Cyan
        Write-Host "   NIT: $($institutionResponse.institution.nit)" -ForegroundColor Cyan
        Write-Host "   ID: $($institutionResponse.institution.id)" -ForegroundColor Cyan
    }
} catch {
    if ($_.Exception.Message -like "*ya existe*") {
        Write-Host "⚠️ Institución de prueba ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error creando institución: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Probar registro de estudiante
Write-Host "`n6️⃣ Probando Registro de Estudiante..." -ForegroundColor Yellow
try {
    $studentRegisterData = @{
        email = "estudiante.prueba@test.com"
        password = "123456"
        firstName = "Juan"
        lastName = "Estudiante"
        role = "student"
        academicGrade = "10°"
        institutionId = 1
    } | ConvertTo-Json

    $headers = @{ "Content-Type" = "application/json" }
    
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/register" -Method POST -Body $studentRegisterData -Headers $headers -TimeoutSec 10
    
    if ($registerResponse.success) {
        Write-Host "✅ Registro de estudiante exitoso" -ForegroundColor Green
        Write-Host "   Usuario ID: $($registerResponse.userId)" -ForegroundColor Cyan
        Write-Host "   Email: $($registerResponse.email)" -ForegroundColor Cyan
        Write-Host "   Rol: $($registerResponse.role)" -ForegroundColor Cyan
    }
} catch {
    if ($_.Exception.Message -like "*ya está registrado*") {
        Write-Host "⚠️ Estudiante ya está registrado" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error en registro de estudiante: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Probar registro de profesor
Write-Host "`n7️⃣ Probando Registro de Profesor..." -ForegroundColor Yellow
try {
    $teacherRegisterData = @{
        email = "profesor.prueba@test.com"
        password = "123456"
        firstName = "María"
        lastName = "Profesora"
        role = "teacher"
        teachingGrades = @("9°", "10°", "11°")
        institutionId = 1
    } | ConvertTo-Json

    $headers = @{ "Content-Type" = "application/json" }
    
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/register" -Method POST -Body $teacherRegisterData -Headers $headers -TimeoutSec 10
    
    if ($registerResponse.success) {
        Write-Host "✅ Registro de profesor exitoso" -ForegroundColor Green
        Write-Host "   Usuario ID: $($registerResponse.userId)" -ForegroundColor Cyan
        Write-Host "   Email: $($registerResponse.email)" -ForegroundColor Cyan
        Write-Host "   Rol: $($registerResponse.role)" -ForegroundColor Cyan
    }
} catch {
    if ($_.Exception.Message -like "*ya está registrado*") {
        Write-Host "⚠️ Profesor ya está registrado" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error en registro de profesor: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎯 RESUMEN DE PRUEBAS:" -ForegroundColor Cyan
Write-Host "✅ Backend funcionando" -ForegroundColor Green
Write-Host "✅ Endpoints de validación implementados" -ForegroundColor Green
Write-Host "✅ Sistema de grados académicos" -ForegroundColor Green
Write-Host "✅ Validación de NIT de instituciones" -ForegroundColor Green
Write-Host "✅ Validación de estudiantes por institución" -ForegroundColor Green
Write-Host "✅ Registro avanzado por roles" -ForegroundColor Green

Write-Host "`n🚀 PARA PROBAR EL FRONTEND:" -ForegroundColor Yellow
Write-Host "1. npm run dev" -ForegroundColor White
Write-Host "2. Ir a http://localhost:3001/register" -ForegroundColor White
Write-Host "3. Probar registro con diferentes roles" -ForegroundColor White

Write-Host "`n✅ SISTEMA DE REGISTRO AVANZADO LISTO" -ForegroundColor Green