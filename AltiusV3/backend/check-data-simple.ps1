# Script simple para verificar datos
Write-Host "Verificando datos de instituciones..." -ForegroundColor Green

# Configuración de base de datos
$dbHost = "localhost"
$dbPort = "3306" 
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

Write-Host "Instituciones:" -ForegroundColor Yellow
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT id, name FROM institutions WHERE is_active = true;"

Write-Host "Usuarios con instituciones:" -ForegroundColor Yellow  
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT u.email, u.first_name, u.role, u.institution_id, i.name as institution_name FROM users u LEFT JOIN institutions i ON u.institution_id = i.id WHERE u.is_active = true LIMIT 10;"

Write-Host "Usuarios sin institucion:" -ForegroundColor Red
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE institution_id IS NULL AND is_active = true;"

Write-Host "Verificacion completada!" -ForegroundColor Green