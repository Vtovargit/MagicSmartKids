Write-Host "ACTUALIZANDO COLORES DEL LOGO MAGICSMARTKIDS" -ForegroundColor Cyan

Write-Host "Limpiando cache de Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    Write-Host "Cache de Vite eliminada" -ForegroundColor Green
}

if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Directorio dist eliminado" -ForegroundColor Green
}

Write-Host "COLORES ACTUALIZADOS:" -ForegroundColor Magenta
Write-Host "AZUL: #4A90E2 (del logo)" -ForegroundColor Blue
Write-Host "VERDE: #50E3C2 (del logo)" -ForegroundColor Green  
Write-Host "AMARILLO: #F5A623 (del logo)" -ForegroundColor Yellow

Write-Host "ARCHIVOS ACTUALIZADOS:" -ForegroundColor Cyan
Write-Host "MagicLogoText.tsx - Colores por letra actualizados" -ForegroundColor Green
Write-Host "Home.tsx - Todos los colores actualizados" -ForegroundColor Green
Write-Host "Login.tsx - Colores y decoraciones actualizadas" -ForegroundColor Green
Write-Host "Register.tsx - Colores y decoraciones actualizadas" -ForegroundColor Green
Write-Host "index.css - Separadores y decoraciones actualizadas" -ForegroundColor Green

Write-Host "INSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "1. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "2. Abre el navegador en modo incognito" -ForegroundColor White
Write-Host "3. Ve a: http://localhost:5173" -ForegroundColor White

Write-Host "COLORES DEL LOGO APLICADOS CORRECTAMENTE!" -ForegroundColor Green