# Script completo para configurar el sistema multiinstitución
Write-Host "🏛️ CONFIGURANDO SISTEMA MULTIINSTITUCIÓN COMPLETO..." -ForegroundColor Green

$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

Write-Host "`n📊 Configurando en el siguiente orden:" -ForegroundColor Cyan
Write-Host "  1. Instituciones educativas" -ForegroundColor White
Write-Host "  2. Usuarios distribuidos por institución" -ForegroundColor White
Write-Host "  3. Materias por institución" -ForegroundColor White
Write-Host "  4. Verificación de relaciones" -ForegroundColor White

# Ejecutar script de datos multiinstitución
Write-Host "`n🏛️ Insertando datos del sistema multiinstitución..." -ForegroundColor Yellow
try {
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "source insert-multi-institution-data.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Datos multiinstitución insertados" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error insertando datos" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificación detallada
Write-Host "`n🔍 VERIFICACIÓN DETALLADA:" -ForegroundColor Cyan
try {
    Write-Host "📊 Conteo por tipo:" -ForegroundColor White
    
    $institutions = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM institutions WHERE is_active = true;" -s -N
    $coordinators = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'COORDINATOR' AND is_active = true;" -s -N
    $teachers = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'TEACHER' AND is_active = true;" -s -N
    $students = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'STUDENT' AND is_active = true;" -s -N
    $subjects = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM subjects WHERE is_active = true;" -s -N
    
    Write-Host "   🏛️ Instituciones: $institutions" -ForegroundColor White
    Write-Host "   👨‍💼 Coordinadores: $coordinators" -ForegroundColor White
    Write-Host "   👩‍🏫 Profesores: $teachers" -ForegroundColor White
    Write-Host "   👨‍🎓 Estudiantes: $students" -ForegroundColor White
    Write-Host "   📚 Materias: $subjects" -ForegroundColor White
    
    Write-Host "`n📋 Distribución por institución:" -ForegroundColor White
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "
    SELECT 
        CONCAT('   ', i.name) as institucion,
        CONCAT('C:', COUNT(CASE WHEN u.role = 'COORDINATOR' THEN 1 END)) as coord,
        CONCAT('P:', COUNT(CASE WHEN u.role = 'TEACHER' THEN 1 END)) as prof,
        CONCAT('E:', COUNT(CASE WHEN u.role = 'STUDENT' THEN 1 END)) as est
    FROM institutions i
    LEFT JOIN users u ON i.id = u.institution_id AND u.is_active = true
    WHERE i.is_active = true
    GROUP BY i.id, i.name
    ORDER BY i.name;" -s
    
} catch {
    Write-Host "❌ Error en verificación" -ForegroundColor Red
}

Write-Host "`n🎯 FUNCIONALIDADES DISPONIBLES:" -ForegroundColor Cyan
Write-Host "   📊 Estadísticas por institución: GET /api/multi-institution/stats/{id}" -ForegroundColor White
Write-Host "   👥 Usuarios por institución: GET /api/multi-institution/users/{id}" -ForegroundColor White
Write-Host "   🏛️ Mis instituciones: GET /api/multi-institution/my-institutions" -ForegroundColor White
Write-Host "   🔄 Cambiar institución: PUT /api/multi-institution/change-primary" -ForegroundColor White
Write-Host "   🔍 Verificar acceso: GET /api/multi-institution/check-access/{id}" -ForegroundColor White

Write-Host "`n👥 USUARIOS DE PRUEBA POR INSTITUCIÓN:" -ForegroundColor Cyan
Write-Host "   🏛️ Colegio San Martín:" -ForegroundColor White
Write-Host "      Coordinador: coordinador@sanmartin.edu.co" -ForegroundColor Gray
Write-Host "      Profesor: laura.garcia@sanmartin.edu.co" -ForegroundColor Gray
Write-Host "      Estudiante: sofia.martin@sanmartin.edu.co" -ForegroundColor Gray
Write-Host "   🏛️ Instituto Los Pinares:" -ForegroundColor White
Write-Host "      Coordinador: coordinador@lospinares.edu.co" -ForegroundColor Gray
Write-Host "      Profesor: sandra.vargas@lospinares.edu.co" -ForegroundColor Gray
Write-Host "      Estudiante: lucia.flores@lospinares.edu.co" -ForegroundColor Gray
Write-Host "   🏛️ Escuela Nuevo Horizonte:" -ForegroundColor White
Write-Host "      Coordinador: coordinador@nuevohorizonte.edu.co" -ForegroundColor Gray
Write-Host "      Profesor: natalia.romero@nuevohorizonte.edu.co" -ForegroundColor Gray
Write-Host "      Estudiante: amelia.mendoza@nuevohorizonte.edu.co" -ForegroundColor Gray

Write-Host "`n🔑 Contraseña para todos: password123" -ForegroundColor Yellow

Write-Host "`n🚀 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "   1. Iniciar backend: mvn spring-boot:run" -ForegroundColor White
Write-Host "   2. Iniciar frontend: npm run dev" -ForegroundColor White
Write-Host "   3. Probar login con usuarios de diferentes instituciones" -ForegroundColor White
Write-Host "   4. Verificar filtros por institución en dashboards" -ForegroundColor White

Write-Host "`n🎉 ¡SISTEMA MULTIINSTITUCIÓN CONFIGURADO EXITOSAMENTE!" -ForegroundColor Green