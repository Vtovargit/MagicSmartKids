# Script para configurar materias y tareas completas
Write-Host "🎯 CONFIGURANDO MATERIAS Y TAREAS..." -ForegroundColor Green

$dbHost = "localhost"
$dbPort = "3306"
$dbName = "altiusv3"
$dbUser = "root"
$dbPassword = "120994"

Write-Host "📚 Insertando 10 materias y 10 tareas con 30 preguntas..." -ForegroundColor Yellow

try {
    mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName < insert-tasks-and-subjects.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Materias y tareas insertadas exitosamente" -ForegroundColor Green
        
        # Verificar resultados
        Write-Host "🔍 Verificando datos insertados..." -ForegroundColor Cyan
        $materias = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM subjects;" -s -N
        $tareas = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM tasks;" -s -N
        $preguntas = mysql -h$dbHost -P$dbPort -u$dbUser -p$dbPassword $dbName -e "SELECT COUNT(*) FROM questions;" -s -N
        
        Write-Host "📊 Resultados:" -ForegroundColor Cyan
        Write-Host "   Materias: $materias" -ForegroundColor White
        Write-Host "   Tareas: $tareas" -ForegroundColor White
        Write-Host "   Preguntas: $preguntas" -ForegroundColor White
        
    } else {
        Write-Host "❌ Error insertando datos" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 ¡Sistema de tareas listo!" -ForegroundColor Green
Write-Host "📋 Los estudiantes ya tienen 10 tareas disponibles" -ForegroundColor Cyan