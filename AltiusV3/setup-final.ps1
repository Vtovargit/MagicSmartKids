# Script final para configurar el sistema de instituciones
Write-Host "🚀 CONFIGURACIÓN FINAL - SISTEMA DE INSTITUCIONES" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host "`n📋 Pasos a seguir:" -ForegroundColor Cyan
Write-Host "1. Configurar base de datos MySQL" -ForegroundColor White
Write-Host "2. Insertar instituciones ficticias" -ForegroundColor White
Write-Host "3. Iniciar backend" -ForegroundColor White
Write-Host "4. Iniciar frontend" -ForegroundColor White
Write-Host "5. Probar el sistema" -ForegroundColor White

Write-Host "`n🔧 PASO 1: Configuración de MySQL" -ForegroundColor Yellow
Write-Host "Ejecuta estos comandos en MySQL:" -ForegroundColor White
Write-Host "  CREATE DATABASE IF NOT EXISTS altiusv3;" -ForegroundColor Gray
Write-Host "  USE altiusv3;" -ForegroundColor Gray
Write-Host "  -- Luego ejecuta: backend/insert-institutions-direct.sql" -ForegroundColor Gray

Write-Host "`n🏛️ PASO 2: Insertar instituciones" -ForegroundColor Yellow
Write-Host "Ejecuta en MySQL el archivo:" -ForegroundColor White
Write-Host "  backend/insert-institutions-direct.sql" -ForegroundColor Gray

Write-Host "`n🖥️ PASO 3: Iniciar backend" -ForegroundColor Yellow
Write-Host "Desde la carpeta backend:" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor Gray
Write-Host "  (El backend estará en http://localhost:8090)" -ForegroundColor Gray

Write-Host "`n🌐 PASO 4: Iniciar frontend" -ForegroundColor Yellow
Write-Host "Desde la carpeta project:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host "  (El frontend estará en http://localhost:3001)" -ForegroundColor Gray

Write-Host "`n🧪 PASO 5: Probar el sistema" -ForegroundColor Yellow
Write-Host "1. Ir a: http://localhost:3001/register" -ForegroundColor White
Write-Host "2. Seleccionar una institución del dropdown" -ForegroundColor White
Write-Host "3. O seleccionar '➕ Crear nueva institución'" -ForegroundColor White
Write-Host "4. Completar el registro" -ForegroundColor White

Write-Host "`n✅ FUNCIONALIDADES IMPLEMENTADAS:" -ForegroundColor Green
Write-Host "• Selección de institución obligatoria en registro" -ForegroundColor White
Write-Host "• 20 instituciones ficticias precargadas" -ForegroundColor White
Write-Host "• Opción 'Crear nueva institución' en dropdown" -ForegroundColor White
Write-Host "• Modal para crear instituciones con validaciones" -ForegroundColor White
Write-Host "• Selección automática de institución recién creada" -ForegroundColor White
Write-Host "• Manejo de errores completo" -ForegroundColor White
Write-Host "• Estados de carga visual" -ForegroundColor White
Write-Host "• Sistema multi-institución completo" -ForegroundColor White

Write-Host "`n🔍 PARA DEPURAR:" -ForegroundColor Cyan
Write-Host "• Revisar logs del backend en la consola" -ForegroundColor White
Write-Host "• Revisar Network tab en DevTools del navegador" -ForegroundColor White
Write-Host "• Ejecutar: .\test-institutions-system.ps1" -ForegroundColor White

Write-Host "`n🎉 ¡Sistema listo para usar!" -ForegroundColor Green