# Script para verificar y arreglar datos de instituciones
Write-Host "🔍 VERIFICANDO DATOS DE INSTITUCIONES..." -ForegroundColor Green

$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

Write-Host "`n📊 Verificando datos en la base..." -ForegroundColor Cyan

# Verificar instituciones
Write-Host "🏛️ Instituciones:" -ForegroundColor Yellow
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT id, name FROM institutions WHERE is_active = true;"

# Verificar usuarios con instituciones
Write-Host "`n👥 Usuarios con instituciones (muestra):" -ForegroundColor Yellow
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "
SELECT 
    u.email,
    u.first_name,
    u.role,
    u.institution_id,
    i.name as institution_name
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
WHERE u.is_active = true
LIMIT 10;"

# Verificar usuarios sin institución
Write-Host "`n⚠️ Usuarios sin institución:" -ForegroundColor Red
$usersWithoutInstitution = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "
SELECT COUNT(*) FROM users WHERE institution_id IS NULL AND is_active = true;" -s -N

Write-Host "   Usuarios sin institución: $usersWithoutInstitution" -ForegroundColor White

if ([int]$usersWithoutInstitution -gt 0) {
    Write-Host "`n🔧 ARREGLANDO USUARIOS SIN INSTITUCIÓN..." -ForegroundColor Yellow
    
    # Asignar institución por defecto a usuarios sin institución
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "
    UPDATE users 
    SET institution_id = 1 
    WHERE institution_id IS NULL AND is_active = true;"
    
    Write-Host "   ✅ Usuarios actualizados con institución por defecto" -ForegroundColor Green
}

# Verificar usuarios de prueba específicos
Write-Host "`n🧪 Verificando usuarios de prueba:" -ForegroundColor Cyan
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "
SELECT 
    u.email,
    u.first_name,
    u.role,
    i.name as institution_name
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
WHERE u.email IN (
    'coordinador@sanmartin.edu.co',
    'laura.garcia@sanmartin.edu.co',
    'sofia.martin@sanmartin.edu.co'
) AND u.is_active = true;"

Write-Host "`n📊 Conteo final por institución:" -ForegroundColor Cyan
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "
SELECT 
    i.name as institucion,
    COUNT(u.id) as total_usuarios
FROM institutions i
LEFT JOIN users u ON i.id = u.institution_id AND u.is_active = true
WHERE i.is_active = true
GROUP BY i.id, i.name
ORDER BY i.name;"

Write-Host "`n🚀 PRÓXIMOS PASOS PARA PROBAR:" -ForegroundColor Green
Write-Host "   1. Iniciar backend: mvn spring-boot:run" -ForegroundColor White
Write-Host "   2. Probar endpoint debug: GET /api/debug/user-info" -ForegroundColor White
Write-Host "   3. Hacer login con: coordinador@sanmartin.edu.co" -ForegroundColor White
Write-Host "   4. Verificar logs del backend para ver institución" -ForegroundColor White

Write-Host "`n✅ Verificación completada!" -ForegroundColor Green