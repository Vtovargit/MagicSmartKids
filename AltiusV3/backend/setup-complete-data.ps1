# Script completo para insertar todos los datos ficticios
Write-Host "🚀 CONFIGURANDO DATOS COMPLETOS DEL SISTEMA..." -ForegroundColor Green

$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

Write-Host "📊 Insertando datos en el siguiente orden:" -ForegroundColor Cyan
Write-Host "  1. Instituciones (si no existen)" -ForegroundColor White
Write-Host "  2. Materias y tareas con preguntas" -ForegroundColor White
Write-Host "  3. 50 profesores y 50 estudiantes" -ForegroundColor White

# Paso 1: Instituciones
Write-Host "`n🏛️ Paso 1: Verificando instituciones..." -ForegroundColor Yellow
try {
    $institutionCount = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM institutions WHERE is_active = true;" -s -N
    
    if ([int]$institutionCount -lt 5) {
        Write-Host "   Insertando instituciones..." -ForegroundColor Gray
        mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < insert-institutions-direct.sql
        Write-Host "   ✅ Instituciones insertadas" -ForegroundColor Green
    } else {
        Write-Host "   ✅ Ya existen $institutionCount instituciones" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Error con instituciones: $($_.Exception.Message)" -ForegroundColor Red
}

# Paso 2: Materias y tareas
Write-Host "`n📚 Paso 2: Insertando materias y tareas..." -ForegroundColor Yellow
try {
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < insert-tasks-and-subjects.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Materias y tareas insertadas" -ForegroundColor Green
        
        # Verificar
        $taskCount = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM tasks;" -s -N
        $questionCount = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM questions;" -s -N
        
        Write-Host "   📊 Tareas: $taskCount | Preguntas: $questionCount" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Error insertando tareas" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Paso 3: Usuarios ficticios
Write-Host "`n👥 Paso 3: Insertando 100 usuarios ficticios..." -ForegroundColor Yellow
try {
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < insert-users-sample.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Usuarios ficticios insertados" -ForegroundColor Green
        
        # Verificar
        $teacherCount = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'TEACHER';" -s -N
        $studentCount = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'STUDENT';" -s -N
        
        Write-Host "   📊 Profesores: $teacherCount | Estudiantes: $studentCount" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Error insertando usuarios" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificación final
Write-Host "`n🔍 VERIFICACIÓN FINAL:" -ForegroundColor Cyan
try {
    Write-Host "📊 Resumen de datos en la base:" -ForegroundColor White
    
    $institutions = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM institutions;" -s -N
    $subjects = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM subjects;" -s -N
    $tasks = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM tasks;" -s -N
    $questions = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM questions;" -s -N
    $teachers = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'TEACHER';" -s -N
    $students = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM users WHERE role = 'STUDENT';" -s -N
    
    Write-Host "   🏛️ Instituciones: $institutions" -ForegroundColor White
    Write-Host "   📚 Materias: $subjects" -ForegroundColor White
    Write-Host "   📝 Tareas: $tasks" -ForegroundColor White
    Write-Host "   ❓ Preguntas: $questions" -ForegroundColor White
    Write-Host "   👩‍🏫 Profesores: $teachers" -ForegroundColor White
    Write-Host "   👨‍🎓 Estudiantes: $students" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error en verificación final" -ForegroundColor Red
}

Write-Host "`n🎉 ¡CONFIGURACIÓN COMPLETA!" -ForegroundColor Green
Write-Host "🚀 Ahora puedes:" -ForegroundColor Cyan
Write-Host "   1. Iniciar backend: mvn spring-boot:run" -ForegroundColor White
Write-Host "   2. Iniciar frontend: npm run dev" -ForegroundColor White
Write-Host "   3. Probar con cualquier usuario creado" -ForegroundColor White
Write-Host "   4. Ver tareas en /teacher/tasks y /student/tasks" -ForegroundColor White