# Script de prueba para el sistema de instituciones
Write-Host "🧪 Probando sistema de instituciones..." -ForegroundColor Green

# Función para hacer requests HTTP
function Test-ApiEndpoint {
    param(
        [string]$Method,
        [string]$Uri,
        [string]$Body = $null
    )
    
    try {
        $headers = @{"Content-Type" = "application/json"}
        
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -Headers $headers
        } else {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $headers
        }
        return $response
    } catch {
        Write-Host "❌ Error en $Method $Uri : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Probar GET /api/institutions
Write-Host "📋 Probando GET /api/institutions..." -ForegroundColor Yellow
$institutions = Test-ApiEndpoint -Method "GET" -Uri "http://localhost:8090/api/institutions"

if ($institutions -and $institutions.success) {
    Write-Host "✅ GET instituciones funciona - Total: $($institutions.total)" -ForegroundColor Green
    
    if ($institutions.total -gt 0) {
        Write-Host "📋 Primeras instituciones:" -ForegroundColor Cyan
        $institutions.institutions | Select-Object -First 3 | ForEach-Object {
            Write-Host "   - $($_.name)" -ForegroundColor White
        }
    }
} else {
    Write-Host "❌ GET instituciones falló" -ForegroundColor Red
}

# Probar POST /api/institutions (crear nueva)
Write-Host "`n➕ Probando POST /api/institutions..." -ForegroundColor Yellow
$newInstitution = @{
    name = "Colegio de Prueba $(Get-Date -Format 'HHmmss')"
    address = "Dirección de prueba"
    phone = "3009999999"
    email = "prueba@test.edu.co"
} | ConvertTo-Json

$createResult = Test-ApiEndpoint -Method "POST" -Uri "http://localhost:8090/api/institutions" -Body $newInstitution

if ($createResult -and $createResult.success) {
    Write-Host "✅ POST crear institución funciona - ID: $($createResult.institution.id)" -ForegroundColor Green
} else {
    Write-Host "❌ POST crear institución falló" -ForegroundColor Red
    if ($createResult) {
        Write-Host "   Error: $($createResult.message)" -ForegroundColor Red
    }
}

# Verificar total después de crear
Write-Host "`n🔍 Verificando total después de crear..." -ForegroundColor Yellow
$institutionsAfter = Test-ApiEndpoint -Method "GET" -Uri "http://localhost:8090/api/institutions"

if ($institutionsAfter -and $institutionsAfter.success) {
    Write-Host "✅ Total instituciones ahora: $($institutionsAfter.total)" -ForegroundColor Green
} else {
    Write-Host "❌ Error verificando total" -ForegroundColor Red
}

Write-Host "`n🎉 Prueba completada!" -ForegroundColor Green