# 🏛️ Sistema Multi-Institución - Altius Academy

## 📋 Descripción

Sistema completo que permite a los usuarios registrarse y gestionar múltiples instituciones educativas. Incluye funcionalidades para crear nuevas instituciones directamente desde el formulario de registro y gestión de estudiantes.

## ✨ Funcionalidades Implementadas

### 🔧 Backend
- ✅ **Entidad UserInstitutionRole**: Relación many-to-many entre usuarios e instituciones
- ✅ **20 Instituciones Ficticias**: Datos de prueba realistas precargados
- ✅ **API Completa**: Endpoints para gestionar instituciones y relaciones
- ✅ **Validaciones**: Manejo de errores y duplicados
- ✅ **Logs Detallados**: Para debugging y monitoreo

### 🎨 Frontend
- ✅ **Registro Mejorado**: Selección de institución obligatoria
- ✅ **Modal de Creación**: Crear nuevas instituciones sin salir del formulario
- ✅ **Gestión de Estudiantes**: Asignación de institución por estudiante
- ✅ **Estados de Carga**: Indicadores visuales y mensajes informativos
- ✅ **Manejo de Errores**: Alertas claras y específicas

## 🚀 Instalación y Configuración

### 1. Configurar Base de Datos

```powershell
# Desde la carpeta backend
cd project/backend

# Ejecutar script completo de configuración
.\setup-complete-system.ps1
```

Este script:
- Crea la tabla `user_institution_roles`
- Inserta 20 instituciones ficticias
- Verifica la configuración

### 2. Iniciar Backend

```powershell
# Desde la carpeta backend
.\mvnw spring-boot:run
```

### 3. Iniciar Frontend

```powershell
# Desde la carpeta project
npm run dev
```

## 📊 Estructura de Base de Datos

### Tabla `institutions`
```sql
- id (BIGINT, PK)
- name (VARCHAR, UNIQUE)
- address (VARCHAR)
- phone (VARCHAR)
- email (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `user_institution_roles`
```sql
- id (BIGINT, PK)
- user_id (BIGINT, FK -> users.id)
- institution_id (BIGINT, FK -> institutions.id)
- role (VARCHAR)
- active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔗 Endpoints API

### Instituciones
- `GET /api/institutions` - Listar todas las instituciones activas
- `POST /api/institutions` - Crear nueva institución
- `GET /api/institutions/{id}` - Obtener institución por ID
- `PUT /api/institutions/{id}` - Actualizar institución

### Relaciones Usuario-Institución
- `POST /api/user-institution-roles/assign` - Asignar usuario a institución
- `GET /api/user-institution-roles/user/{userId}/institutions` - Instituciones del usuario
- `GET /api/user-institution-roles/institution/{institutionId}/users` - Usuarios de la institución
- `GET /api/user-institution-roles/institution/{institutionId}/role/{role}` - Usuarios por rol
- `DELETE /api/user-institution-roles/deactivate` - Desactivar asignación

## 🎯 Flujo de Uso

### Registro de Usuario
1. Usuario accede a `/register`
2. Completa datos personales
3. Selecciona institución del dropdown (20 opciones disponibles)
4. Si no encuentra su institución, selecciona "➕ Crear nueva institución"
5. Modal se abre para crear institución con datos básicos
6. Nueva institución se crea y selecciona automáticamente
7. Usuario completa registro exitosamente

### Gestión de Estudiantes
1. Coordinador/Profesor accede a `/student-management`
2. Crea nuevo estudiante
3. Selecciona institución (misma funcionalidad que registro)
4. Estudiante queda vinculado a la institución seleccionada

## 🔍 Validaciones Implementadas

### Frontend
- ✅ Institución obligatoria en registro
- ✅ Validación de campos requeridos en modal
- ✅ Mensajes de error específicos
- ✅ Estados de carga visual
- ✅ Prevención de envío con datos inválidos

### Backend
- ✅ Verificación de institución existente
- ✅ Prevención de nombres duplicados
- ✅ Validación de datos requeridos
- ✅ Manejo de errores de base de datos
- ✅ Logs detallados para debugging

## 📱 Componentes Creados

### `CreateInstitutionModal.tsx`
Modal reutilizable para crear nuevas instituciones con:
- Formulario completo (nombre, dirección, teléfono, email)
- Validaciones en tiempo real
- Estados de carga
- Manejo de errores
- Integración automática con componentes padre

### Actualizaciones en `Register.tsx`
- Carga automática de instituciones
- Integración con modal de creación
- Selección automática de institución recién creada
- Estados de carga y error mejorados

### Actualizaciones en `StudentManagement.tsx`
- Misma funcionalidad que registro
- Integración con gestión de estudiantes
- Validaciones específicas para estudiantes

## 🧪 Datos de Prueba

### Instituciones Ficticias Incluidas
1. Colegio Central
2. Instituto Saber
3. Escuela Nueva Esperanza
4. Colegio San José
5. Instituto Técnico Industrial
6. Escuela Bilingüe Internacional
7. Colegio Santa María
8. Instituto de Ciencias Aplicadas
9. Escuela Rural El Progreso
10. Colegio Moderno
... (hasta 20 instituciones)

## 🔧 Troubleshooting

### Error: "No hay instituciones disponibles"
```sql
-- Verificar instituciones en base de datos
SELECT COUNT(*) FROM institutions WHERE is_active = true;

-- Si es 0, ejecutar:
.\insert-sample-institutions.ps1
```

### Error: "Institución no encontrada"
- Verificar que el ID de institución existe
- Revisar logs del backend para detalles
- Confirmar que la institución está activa

### Error de conexión API
- Verificar que el backend esté corriendo en puerto 8080
- Confirmar configuración de CORS
- Revisar logs de consola del navegador

## 📈 Próximas Mejoras

- [ ] Filtros por institución en listados
- [ ] Dashboard específico por institución
- [ ] Reportes por institución
- [ ] Gestión de permisos granular
- [ ] Notificaciones por institución
- [ ] Configuración personalizada por institución

## 🎉 Estado Actual

✅ **COMPLETAMENTE FUNCIONAL**

El sistema está listo para usar con todas las funcionalidades implementadas y probadas. Los usuarios pueden registrarse, seleccionar o crear instituciones, y gestionar estudiantes con vinculación institucional completa.