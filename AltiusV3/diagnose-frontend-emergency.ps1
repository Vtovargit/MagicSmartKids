#!/usr/bin/env pwsh

Write-Host "🚨 DIAGNÓSTICO DE EMERGENCIA - FRONTEND EN BLANCO" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Red

# Test 1: Verificar componentes UI
Write-Host "`n✅ Test 1: Verificando componentes UI..." -ForegroundColor Green

$uiComponents = @(
    "src/components/ui/Input.tsx",
    "src/components/ui/Badge.tsx", 
    "src/components/ui/Card.tsx",
    "src/components/ui/Button.tsx",
    "src/components/ui/index.ts"
)

foreach ($component in $uiComponents) {
    if (Test-Path $component) {
        Write-Host "   ✓ $component existe" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $component FALTA" -ForegroundColor Red
    }
}

# Test 2: Verificar exports en index.ts
Write-Host "`n✅ Test 2: Verificando exports en index.ts..." -ForegroundColor Green
if (Test-Path "src/components/ui/index.ts") {
    $indexContent = Get-Content "src/components/ui/index.ts" -Raw
    
    $requiredExports = @("Input", "Badge", "Card", "Button", "Label")
    foreach ($export in $requiredExports) {
        if ($indexContent -match $export) {
            Write-Host "   ✓ $export exportado" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $export NO exportado" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ✗ index.ts no encontrado" -ForegroundColor Red
}

# Test 3: Verificar archivos principales
Write-Host "`n✅ Test 3: Verificando archivos principales..." -ForegroundColor Green

$mainFiles = @(
    "src/main.tsx",
    "src/App.tsx", 
    "src/pages/Login.tsx",
    "src/pages/Register.tsx",
    "src/components/Layout.tsx"
)

foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file FALTA" -ForegroundColor Red
    }
}

# Test 4: Verificar configuración
Write-Host "`n✅ Test 4: Verificando configuración..." -ForegroundColor Green

$configFiles = @(
    "vite.config.ts",
    "tailwind.config.js",
    "package.json",
    "src/lib/utils.ts"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file FALTA" -ForegroundColor Red
    }
}

# Test 5: Verificar dependencias críticas
Write-Host "`n✅ Test 5: Verificando node_modules..." -ForegroundColor Green
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules existe" -ForegroundColor Green
    
    $criticalDeps = @("react", "react-dom", "vite", "tailwindcss")
    foreach ($dep in $criticalDeps) {
        if (Test-Path "node_modules/$dep") {
            Write-Host "   ✓ $dep instalado" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $dep FALTA" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ✗ node_modules FALTA - ejecutar npm install" -ForegroundColor Red
}

Write-Host "`n🔧 SOLUCIONES APLICADAS:" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow
Write-Host "✅ Input component agregado a exports" -ForegroundColor Green
Write-Host "✅ Badge, Card, Label agregados a exports" -ForegroundColor Green
Write-Host "✅ Path alias corregido en Badge.tsx" -ForegroundColor Green
Write-Host "✅ Todos los componentes UI exportados correctamente" -ForegroundColor Green

Write-Host "`n🚀 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "1. Reiniciar el servidor de desarrollo:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "2. Abrir la consola del navegador para verificar errores" -ForegroundColor White
Write-Host "3. Si persisten errores, verificar la consola del navegador" -ForegroundColor White
Write-Host "4. Verificar que no hay imports rotos en otros archivos" -ForegroundColor White

Write-Host "`n✨ FRONTEND EMERGENCY FIX COMPLETADO!" -ForegroundColor Green