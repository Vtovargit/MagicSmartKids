# Script para subir Altius V3 a GitHub
Write-Host "🚀 SUBIENDO ALTIUS V3 A GITHUB..." -ForegroundColor Green
Write-Host ""

# Verificar si Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git detectado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "📥 Descarga Git desde: https://git-scm.com/download/windows" -ForegroundColor Yellow
    Write-Host "📋 Después de instalar, ejecuta este script nuevamente" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Inicializar repositorio si no existe
if (-not (Test-Path ".git")) {
    Write-Host "🔧 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host ""
}

# Agregar archivos
Write-Host "📁 Agregando archivos al repositorio..." -ForegroundColor Yellow
git add .
Write-Host ""

# Hacer commit
Write-Host "💾 Creando commit inicial..." -ForegroundColor Yellow
$commitMessage = @"
🎉 Initial commit - Altius Academy V3 complete system

✅ Features implemented:
- Multi-institution support
- Role-based authentication (Student, Teacher, Coordinator, Parent, Secretary, Admin)
- Task and subject management
- 100 fictional users (50 teachers + 50 students)
- 10 subjects with educational content
- 10 tasks with 30 questions
- Complete REST API with Spring Boot
- React frontend with TypeScript
- MySQL database integration
- JWT authentication
- Responsive UI with Tailwind CSS

🏗️ Architecture:
- Backend: Spring Boot 3.x + Java 17 + MySQL
- Frontend: React 18 + TypeScript + Vite
- Security: Spring Security + JWT
- Database: MySQL 8.0 with sample data

📊 Sample Data:
- 20 institutions
- 50 teachers with realistic names/emails
- 50 students distributed across institutions
- 10 educational subjects
- 10 tasks with multiple choice questions

🔧 Ready for production deployment!
"@

git commit -m $commitMessage
Write-Host ""

# Agregar repositorio remoto
Write-Host "🔗 Configurando repositorio remoto..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/ValentinaITDev/AltiusV3.git
Write-Host ""

# Verificar conexión
Write-Host "🔍 Verificando conexión..." -ForegroundColor Yellow
git remote -v
Write-Host ""

# Configurar rama principal
Write-Host "🌿 Configurando rama principal..." -ForegroundColor Yellow
git branch -M main
Write-Host ""

# Subir al repositorio
Write-Host "📤 Subiendo archivos a GitHub..." -ForegroundColor Yellow
Write-Host "🔐 Se te pedirá tu usuario y token de GitHub" -ForegroundColor Cyan
Write-Host "💡 Usa tu token personal como contraseña (no tu contraseña normal)" -ForegroundColor Cyan
Write-Host ""

try {
    git push -u origin main
    
    Write-Host ""
    Write-Host "🎉 ¡PROYECTO SUBIDO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Tu repositorio está disponible en:" -ForegroundColor Cyan
    Write-Host "   https://github.com/ValentinaITDev/AltiusV3" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Verificar que todos los archivos se subieron correctamente" -ForegroundColor White
    Write-Host "   2. Configurar GitHub Pages si deseas (opcional)" -ForegroundColor White
    Write-Host "   3. Invitar colaboradores si es necesario" -ForegroundColor White
    Write-Host "   4. Configurar branch protection rules (recomendado)" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Error al subir archivos" -ForegroundColor Red
    Write-Host "🔧 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "   1. Verificar que el repositorio existe en GitHub" -ForegroundColor White
    Write-Host "   2. Usar token personal en lugar de contraseña" -ForegroundColor White
    Write-Host "   3. Verificar permisos de acceso" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Crear token: https://github.com/settings/tokens" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Presiona Enter para continuar"