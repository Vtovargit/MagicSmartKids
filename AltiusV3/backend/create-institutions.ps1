# Script simple para crear instituciones via API
Write-Host "Configurando instituciones..." -ForegroundColor Green

# Esperar a que el backend esté listo
Write-Host "Esperando que el backend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Verificar que el backend esté corriendo
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8090/actuator/health" -Method GET
    Write-Host "Backend está corriendo" -ForegroundColor Green
} catch {
    Write-Host "Backend no está corriendo. Inicialo primero." -ForegroundColor Red
    exit 1
}

# Verificar instituciones existentes
try {
    $existing = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions" -Method GET
    if ($existing.institutions -and $existing.institutions.Count -gt 0) {
        Write-Host "Ya existen $($existing.institutions.Count) instituciones" -ForegroundColor Green
        Write-Host "Sistema listo para usar!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Verificando instituciones..." -ForegroundColor Yellow
}

# Crear instituciones ficticias
Write-Host "Creando instituciones ficticias..." -ForegroundColor Yellow

$instituciones = @(
    '{"name": "Colegio Central", "address": "Calle 123 #45-67", "phone": "3001234567", "email": "info@central.edu.co"}',
    '{"name": "Instituto Saber", "address": "Carrera 45 #10-20", "phone": "3101111111", "email": "contacto@saber.edu.co"}',
    '{"name": "Escuela Nueva Esperanza", "address": "Avenida 5 No. 8-30", "phone": "3122222222", "email": "admin@esperanza.edu.co"}',
    '{"name": "Colegio San José", "address": "Calle 67 #23-45", "phone": "3133333333", "email": "secretaria@sanjose.edu.co"}',
    '{"name": "Instituto Técnico Industrial", "address": "Carrera 30 #50-80", "phone": "3144444444", "email": "info@tecnico.edu.co"}'
)

$created = 0
foreach ($inst in $instituciones) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8090/api/institutions" -Method POST -Body $inst -ContentType "application/json"
        if ($response.success) {
            $created++
            Write-Host "Creada: $($response.institution.name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error creando institución" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "Creadas $created instituciones" -ForegroundColor Green
Write-Host "Sistema configurado!" -ForegroundColor Green