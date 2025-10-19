# 📤 Instrucciones para Subir a GitHub

## 🚀 Pasos para subir el proyecto a https://github.com/ValentinaITDev/AltiusV3.git

### 1. Instalar Git (si no está instalado)
Descargar e instalar Git desde: https://git-scm.com/download/windows

### 2. Abrir terminal en la carpeta del proyecto
```bash
cd C:\Users\vt232\Downloads\AltiusV3\project
```

### 3. Inicializar repositorio Git
```bash
git init
```

### 4. Agregar archivos al repositorio
```bash
git add .
```

### 5. Hacer el primer commit
```bash
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
```

### 6. Agregar el repositorio remoto
```bash
git remote add origin https://github.com/ValentinaITDev/AltiusV3.git
```

### 7. Verificar la conexión
```bash
git remote -v
```

### 8. Subir al repositorio
```bash
git branch -M main
git push -u origin main
```

## 🔐 Si necesitas autenticación

### Opción 1: Token Personal (Recomendado)
1. Ir a GitHub → Settings → Developer settings → Personal access tokens
2. Generar nuevo token con permisos de repositorio
3. Usar el token como contraseña cuando Git lo pida

### Opción 2: SSH (Alternativo)
```bash
# Generar clave SSH
ssh-keygen -t rsa -b 4096 -C "tu-email@ejemplo.com"

# Agregar clave a GitHub
cat ~/.ssh/id_rsa.pub
# Copiar y pegar en GitHub → Settings → SSH Keys

# Cambiar URL a SSH
git remote set-url origin git@github.com:ValentinaITDev/AltiusV3.git
```

## 📁 Estructura que se subirá

```
AltiusV3/
├── .gitignore                 # Archivos a ignorar
├── README.md                  # Documentación principal
├── DEPLOYMENT.md              # Guía de despliegue
├── package.json               # Dependencias frontend
├── vite.config.ts            # Configuración Vite
├── src/                      # Código fuente React
│   ├── components/           # Componentes UI
│   ├── pages/               # Páginas principales
│   ├── stores/              # Estado global
│   └── utils/               # Utilidades
├── backend/                  # Spring Boot backend
│   ├── src/main/java/       # Código Java
│   ├── src/main/resources/  # Configuraciones
│   ├── pom.xml              # Dependencias Maven
│   ├── insert-*.sql         # Scripts de datos
│   └── *.ps1                # Scripts de configuración
└── public/                   # Archivos estáticos
```

## ✅ Verificación después de subir

1. **Ir a**: https://github.com/ValentinaITDev/AltiusV3
2. **Verificar que aparezcan**:
   - Todos los archivos del proyecto
   - README.md con documentación
   - Estructura de carpetas correcta
   - Archivos .gitignore funcionando

## 🔄 Para actualizaciones futuras

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "✨ Add new feature: [descripción]"

# Subir cambios
git push origin main
```

## 🏷️ Para crear releases

```bash
# Crear tag
git tag -a v1.0.0 -m "🎉 Release v1.0.0 - Complete system ready"

# Subir tag
git push origin v1.0.0
```

## 🌟 Comandos útiles

```bash
# Ver estado
git status

# Ver historial
git log --oneline

# Ver ramas
git branch -a

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Fusionar rama
git merge feature/nueva-funcionalidad
```

## 🚨 Troubleshooting

### Error: "Repository not found"
- Verificar que el repositorio existe en GitHub
- Verificar permisos de acceso
- Verificar URL del repositorio

### Error: "Authentication failed"
- Usar token personal en lugar de contraseña
- Verificar credenciales
- Configurar SSH si es necesario

### Error: "Large files"
- Verificar .gitignore
- Usar Git LFS para archivos grandes
- Remover archivos innecesarios

---

**¡Proyecto listo para GitHub! 🎉**

Una vez subido, el repositorio estará disponible en:
**https://github.com/ValentinaITDev/AltiusV3**