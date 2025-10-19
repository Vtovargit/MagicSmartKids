# Script simple para insertar datos
Write-Host "Insertando datos ficticios..." -ForegroundColor Green

# Configuración de base de datos
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

# Ejecutar scripts SQL
Write-Host "1. Insertando instituciones..." -ForegroundColor Yellow
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "source insert-institutions-direct.sql"

Write-Host "2. Insertando materias y tareas..." -ForegroundColor Yellow
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "source insert-tasks-and-subjects.sql"

Write-Host "3. Insertando usuarios ficticios..." -ForegroundColor Yellow
mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "source insert-users-sample.sql"

Write-Host "Datos insertados correctamente!" -ForegroundColor Green