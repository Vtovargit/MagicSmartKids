# Script para probar endpoints del sistema
Write-Host "🧪 PROBANDO ENDPOINTS DEL SISTEMA..." -ForegroundColor Green

$baseUrl = "http://localhost:8080"

Write-Host "`n📊 Probando endpoints públicos..." -ForegroundColor Cyan

# Probar endpoint de tareas (público para debugging)
try {
    Write-Host "GET /api/tasks" -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/api/tasks" -Method GET
    Write-Host "✅ Tareas encontradas: $($response.total)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de materias
try {
    Write-Host "GET /api/subjects" -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/api/subjects" -Method GET
    Write-Host "✅ Materias encontradas: $($response.total)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de health
try {
    Write-Host "GET /api/health" -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 RESUMEN:" -ForegroundColor Cyan
Write-Host "Si ves ✅ en todos los endpoints, el sistema está funcionando correctamente" -ForegroundColor White
Write-Host "Si ves ❌, verifica que:" -ForegroundColor White
Write-Host "  1. El backend esté corriendo (mvn spring-boot:run)" -ForegroundColor White
Write-Host "  2. MySQL esté corriendo y con datos" -ForegroundColor White
Write-Host "  3. Los puertos 8080 y 3306 estén disponibles" -ForegroundColor White