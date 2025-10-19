# Script simplificado para configurar el sistema multi-institucion
# Ejecutar desde la carpeta backend: .\setup-system.ps1

Write-Host "Configurando sistema multi-institucion..." -ForegroundColor Green

# Configuracion de la base de datos
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altius_academy"
$dbUser = "root"
$dbPassword = "admin123"

Write-Host "Paso 1: Creando tabla user_institution_roles..." -ForegroundColor Yellow

try {
    $createTableCmd = "mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e `"source create-user-institution-roles-table.sql`""
    Invoke-Expression $createTableCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Tabla user_institution_roles creada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Error creando tabla user_institution_roles" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error en paso 1: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Paso 2: Insertando instituciones ficticias..." -ForegroundColor Yellow

try {
    $insertDataCmd = "mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e `"source insert-sample-institutions.sql`""
    Invoke-Expression $insertDataCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Instituciones ficticias insertadas exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Error insertando instituciones" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error en paso 2: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Paso 3: Verificando configuracion..." -ForegroundColor Yellow

try {
    $verifyCmd = "mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e `"SELECT COUNT(*) as total FROM institutions WHERE is_active = true;`""
    $result = Invoke-Expression $verifyCmd
    
    Write-Host "Verificacion completada" -ForegroundColor Green
    Write-Host $result
    
} catch {
    Write-Host "Error en verificacion: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Sistema configurado exitosamente!" -ForegroundColor Green
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "1. Iniciar el backend: .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "2. Iniciar el frontend: npm run dev" -ForegroundColor White