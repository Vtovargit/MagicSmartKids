# Script para configurar instituciones usando la API REST
# Ejecutar desde la carpeta backend: .\setup-institutions.ps1

Write-Host "🏛️ CONFIGURANDO INSTITUCIONES - ALTIUS ACADEMY" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Función para hacer requests HTTP
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Uri,
        [string]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -Headers $Headers
        } else {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers
        }
        return $response
    } catch {
        Write-Host "❌ Error en request: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Verificar que el backend esté corriendo
Write-Host "`n🚀 Verificando que el backend esté corriendo..." -ForegroundColor Yellow
$healthCheck = Invoke-ApiRequest -Method "GET" -Uri "http://localhost:8090/actuator/health"

if ($healthCheck) {
    Write-Host "✅ Backend está corriendo correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Backend no está corriendo. Inicia el backend primero con: .\mvnw spring-boot:run" -ForegroundColor Red
    exit 1
}

# Verificar instituciones existentes
Write-Host "`n🔍 Verificando instituciones existentes..." -ForegroundColor Yellow
$existingInstitutions = Invoke-ApiRequest -Method "GET" -Uri "http://localhost:8090/api/institutions"

if ($existingInstitutions -and $existingInstitutions.institutions) {
    $count = $existingInstitutions.institutions.Count
    Write-Host "✅ Se encontraron $count instituciones existentes" -ForegroundColor Green
    
    if ($count -ge 20) {
        Write-Host "✅ Ya hay suficientes instituciones configuradas" -ForegroundColor Green
        Write-Host "`n📋 Primeras 5 instituciones:" -ForegroundColor Cyan
        for ($i = 0; $i -lt [Math]::Min(5, $count); $i++) {
            $inst = $existingInstitutions.institutions[$i]
            Write-Host "   $($inst.id). $($inst.name)" -ForegroundColor White
        }
        Write-Host "`n🎉 Sistema listo para usar!" -ForegroundColor Green
        exit 0
    }
} else {
    Write-Host "⚠️ No se encontraron instituciones. Creando instituciones ficticias..." -ForegroundColor Yellow
}

# Lista de 20 instituciones ficticias
$instituciones = @(
    @{ name = "Colegio Central"; address = "Calle 123 #45-67, Centro"; phone = "3001234567"; email = "info@colegiocentral.edu.co" },
    @{ name = "Instituto Saber"; address = "Carrera 45 #10-20, Norte"; phone = "3101111111"; email = "contacto@institutosaber.edu.co" },
    @{ name = "Escuela Nueva Esperanza"; address = "Avenida 5 No. 8-30, Sur"; phone = "3122222222"; email = "admin@nuevaesperanza.edu.co" },
    @{ name = "Colegio San José"; address = "Calle 67 #23-45, Chapinero"; phone = "3133333333"; email = "secretaria@sanjose.edu.co" },
    @{ name = "Instituto Técnico Industrial"; address = "Carrera 30 #50-80, Zona Industrial"; phone = "3144444444"; email = "info@tecnicoindustrial.edu.co" },
    @{ name = "Escuela Bilingüe Internacional"; address = "Calle 85 #15-30, Zona Rosa"; phone = "3155555555"; email = "admissions@bilingue.edu.co" },
    @{ name = "Colegio Santa María"; address = "Avenida 68 #40-25, Engativá"; phone = "3166666666"; email = "info@santamaria.edu.co" },
    @{ name = "Instituto de Ciencias Aplicadas"; address = "Carrera 7 #32-18, Centro"; phone = "3177777777"; email = "contacto@cienciasaplicadas.edu.co" },
    @{ name = "Escuela Rural El Progreso"; address = "Vereda El Progreso, Km 15"; phone = "3188888888"; email = "direccion@elprogreso.edu.co" },
    @{ name = "Colegio Moderno"; address = "Calle 100 #20-50, Zona Norte"; phone = "3199999999"; email = "info@colegiomoderno.edu.co" },
    @{ name = "Instituto Pedagógico Nacional"; address = "Carrera 15 #75-40, Chapinero"; phone = "3200000000"; email = "secretaria@pedagogico.edu.co" },
    @{ name = "Escuela de Artes y Oficios"; address = "Calle 26 #68-35, Teusaquillo"; phone = "3211111111"; email = "info@artesyoficios.edu.co" },
    @{ name = "Colegio Campestre Los Nogales"; address = "Km 20 Vía La Calera"; phone = "3222222222"; email = "admisiones@losnogales.edu.co" },
    @{ name = "Instituto Comercial"; address = "Avenida Jiménez #12-45, Centro"; phone = "3233333333"; email = "contacto@comercial.edu.co" },
    @{ name = "Escuela Deportiva"; address = "Calle 63 #45-20, Zona Deportiva"; phone = "3244444444"; email = "info@deportiva.edu.co" },
    @{ name = "Colegio La Salle"; address = "Carrera 5 #56-78, La Candelaria"; phone = "3255555555"; email = "secretaria@lasalle.edu.co" },
    @{ name = "Instituto de Idiomas"; address = "Calle 93 #30-15, Zona Rosa"; phone = "3266666666"; email = "info@idiomas.edu.co" },
    @{ name = "Escuela Técnica Agropecuaria"; address = "Vereda San Antonio, Km 25"; phone = "3277777777"; email = "direccion@agropecuaria.edu.co" },
    @{ name = "Colegio Mixto Bolivariano"; address = "Avenida Boyacá #80-45, Fontibón"; phone = "3288888888"; email = "info@bolivariano.edu.co" },
    @{ name = "Instituto Superior de Tecnología"; address = "Carrera 50 #25-60, Zona Industrial"; phone = "3299999999"; email = "contacto@tecnologia.edu.co" }
)

Write-Host "`n📝 Creando 20 instituciones ficticias..." -ForegroundColor Yellow

$createdCount = 0
$errorCount = 0

foreach ($institucion in $instituciones) {
    $institutionData = $institucion | ConvertTo-Json
    
    Write-Host "   Creando: $($institucion.name)..." -ForegroundColor Gray
    
    $response = Invoke-ApiRequest -Method "POST" -Uri "http://localhost:8090/api/institutions" -Body $institutionData
    
    if ($response -and $response.success) {
        $createdCount++
        Write-Host "   ✅ $($institucion.name) creada" -ForegroundColor Green
    } else {
        $errorCount++
        Write-Host "   ❌ Error creando $($institucion.name)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 100  # Pequeña pausa entre requests
}

Write-Host "`n📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "✅ Instituciones creadas: $createdCount" -ForegroundColor Green
Write-Host "❌ Errores: $errorCount" -ForegroundColor Red

# Verificar resultado final
Write-Host "`n🔍 Verificando resultado final..." -ForegroundColor Yellow
$finalCheck = Invoke-ApiRequest -Method "GET" -Uri "http://localhost:8090/api/institutions"

if ($finalCheck -and $finalCheck.institutions) {
    $totalCount = $finalCheck.institutions.Count
    Write-Host "✅ Total de instituciones disponibles: $totalCount" -ForegroundColor Green
    
    Write-Host "`n📋 Instituciones disponibles:" -ForegroundColor Cyan
    foreach ($inst in $finalCheck.institutions) {
        Write-Host "   $($inst.id). $($inst.name)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error verificando instituciones" -ForegroundColor Red
}

Write-Host "`n🎉 Configuración completada!" -ForegroundColor Green
Write-Host "`n🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. El backend ya está corriendo ✅" -ForegroundColor White
Write-Host "2. Iniciar el frontend: npm run dev" -ForegroundColor White
Write-Host "3. Probar registro en: http://localhost:5173/register" -ForegroundColor White