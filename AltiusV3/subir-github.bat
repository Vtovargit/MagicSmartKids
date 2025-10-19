@echo off
echo 🚀 SUBIENDO ALTIUS V3 A GITHUB...
echo.

REM Verificar si Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git no está instalado o no está en el PATH
    echo 📥 Descarga Git desde: https://git-scm.com/download/windows
    echo 📋 Después de instalar, ejecuta este script nuevamente
    pause
    exit /b 1
)

echo ✅ Git detectado correctamente
echo.

REM Inicializar repositorio si no existe
if not exist .git (
    echo 🔧 Inicializando repositorio Git...
    git init
    echo.
)

REM Agregar archivos
echo 📁 Agregando archivos al repositorio...
git add .
echo.

REM Hacer commit
echo 💾 Creando commit inicial...
git commit -m "🎉 Initial commit - Altius Academy V3 complete system

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

🔧 Ready for production deployment!"
echo.

REM Agregar repositorio remoto
echo 🔗 Configurando repositorio remoto...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/ValentinaITDev/AltiusV3.git
echo.

REM Verificar conexión
echo 🔍 Verificando conexión...
git remote -v
echo.

REM Configurar rama principal
echo 🌿 Configurando rama principal...
git branch -M main
echo.

REM Subir al repositorio
echo 📤 Subiendo archivos a GitHub...
echo 🔐 Se te pedirá tu usuario y token de GitHub
echo 💡 Usa tu token personal como contraseña (no tu contraseña normal)
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Error al subir archivos
    echo 🔧 Posibles soluciones:
    echo    1. Verificar que el repositorio existe en GitHub
    echo    2. Usar token personal en lugar de contraseña
    echo    3. Verificar permisos de acceso
    echo.
    echo 🔗 Crear token: https://github.com/settings/tokens
    pause
    exit /b 1
)

echo.
echo 🎉 ¡PROYECTO SUBIDO EXITOSAMENTE!
echo.
echo 🌐 Tu repositorio está disponible en:
echo    https://github.com/ValentinaITDev/AltiusV3
echo.
echo 📋 Próximos pasos:
echo    1. Verificar que todos los archivos se subieron correctamente
echo    2. Configurar GitHub Pages si deseas (opcional)
echo    3. Invitar colaboradores si es necesario
echo    4. Configurar branch protection rules (recomendado)
echo.
pause