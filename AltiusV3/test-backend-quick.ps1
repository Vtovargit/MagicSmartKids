# Prueba rápida del backend
Write-Host "🧪 Prueba rápida del backend..." -ForegroundColor Green

# Probar health check
Write-Host "`n💓 Probando health check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8090/actuator/health" -Method GET
    Write-Host "✅ Backend está corriendo: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no está corriendo o no responde" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Probar GET instituciones
Write-Host "`n🏛️ Probando GET /api/institutions..." -ForegroundColor Yellow
try {
    $institutions = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions" -Method GET
    Write-Host "✅ GET instituciones funciona" -ForegroundColor Green
    Write-Host "   Total instituciones: $($institutions.total)" -ForegroundColor Cyan
    
    if ($institutions.institutions -and $institutions.institutions.Count -gt 0) {
        Write-Host "   Primeras 3 instituciones:" -ForegroundColor Cyan
        $institutions.institutions | Select-Object -First 3 | ForEach-Object {
            Write-Host "     - $($_.name)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Error en GET instituciones" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Mostrar más detalles del error
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Probar POST institución
Write-Host "`n➕ Probando POST /api/institutions..." -ForegroundColor Yellow
$testInstitution = @{
    name = "Colegio de Prueba $(Get-Date -Format 'HHmmss')"
    address = "Dirección de prueba"
    phone = "3009999999"
    email = "prueba@test.edu.co"
} | ConvertTo-Json

try {
    $createResult = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions" -Method POST -Body $testInstitution -ContentType "application/json"
    Write-Host "✅ POST crear institución funciona" -ForegroundColor Green
    Write-Host "   ID creado: $($createResult.institution.id)" -ForegroundColor Cyan
    Write-Host "   Nombre: $($createResult.institution.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en POST crear institución" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Mostrar más detalles del error
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Prueba completada!" -ForegroundColor Green