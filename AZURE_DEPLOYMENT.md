# 🚀 Magic Smart Kids - Azure Deployment Guide

## 📋 Configuración del Proyecto

- **Nombre del Proyecto**: magicsmartkids
- **Región Azure**: eastus
- **Base de Datos**: MySQL Flexible Server
- **Contraseña MySQL**: Altius120994!
- **JWT Secret**: magicsmartkids-jwt-secret-120994

## 🔧 Pre-requisitos

1. **Azure CLI** instalado
   ```bash
   # Verificar instalación
   az --version
   ```

2. **Docker** instalado y corriendo
   ```bash
   # Verificar instalación
   docker --version
   ```

3. **Cuenta de Azure** activa con permisos de administrador

## 🎯 Pasos de Deployment

### Opción 1: Script Automático (Recomendado)

#### Windows:
```cmd
cd scripts
deploy-azure.bat
```

#### Linux/Mac:
```bash
cd scripts
chmod +x deploy-azure.sh
./deploy-azure.sh
```

### Opción 2: Deployment Manual

#### 1. Login a Azure
```bash
az login
```

#### 2. Crear Resource Group
```bash
az group create --name magicsmartkids-rg --location eastus
```

#### 3. Crear Container Registry
```bash
az acr create --resource-group magicsmartkids-rg --name magicsmartkidsacr --sku Basic --admin-enabled true
```

#### 4. Build y Push de Imágenes
```bash
# Login al registry
az acr login --name magicsmartkidsacr

# Backend
docker build -f Dockerfile.backend -t magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest .
docker push magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest

# Frontend
docker build -f Dockerfile.frontend -t magicsmartkidsacr.azurecr.io/magicsmartkids-frontend:latest .
docker push magicsmartkidsacr.azurecr.io/magicsmartkids-frontend:latest
```

#### 5. Crear MySQL Server
```bash
az mysql flexible-server create \
    --resource-group magicsmartkids-rg \
    --name magicsmartkids-mysql \
    --location eastus \
    --admin-user altius_admin \
    --admin-password "Altius120994!" \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --storage-size 32 \
    --version 8.0.21 \
    --public-access 0.0.0.0-255.255.255.255

# Crear base de datos
az mysql flexible-server db create \
    --resource-group magicsmartkids-rg \
    --server-name magicsmartkids-mysql \
    --database-name altius_academy
```

#### 6. Crear Container Apps Environment
```bash
az containerapp env create \
    --name magicsmartkids-env \
    --resource-group magicsmartkids-rg \
    --location eastus
```

#### 7. Deploy Backend
```bash
az containerapp create \
    --name magicsmartkids-backend \
    --resource-group magicsmartkids-rg \
    --environment magicsmartkids-env \
    --image magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest \
    --target-port 8080 \
    --ingress external \
    --registry-server magicsmartkidsacr.azurecr.io \
    --env-vars \
        "SPRING_DATASOURCE_URL=jdbc:mysql://[MYSQL_HOST]:3306/altius_academy?useSSL=true&requireSSL=false" \
        "SPRING_DATASOURCE_USERNAME=altius_admin" \
        "SPRING_DATASOURCE_PASSWORD=Altius120994!" \
        "JWT_SECRET=magicsmartkids-jwt-secret-120994" \
    --cpu 1.0 \
    --memory 2.0Gi
```

#### 8. Deploy Frontend
```bash
az containerapp create \
    --name magicsmartkids-frontend \
    --resource-group magicsmartkids-rg \
    --environment magicsmartkids-env \
    --image magicsmartkidsacr.azurecr.io/magicsmartkids-frontend:latest \
    --target-port 80 \
    --ingress external \
    --registry-server magicsmartkidsacr.azurecr.io \
    --env-vars "VITE_API_URL=https://[BACKEND_URL]" \
    --cpu 0.5 \
    --memory 1.0Gi
```

## 📊 Verificar Deployment

```bash
# Ver todas las apps
az containerapp list --resource-group magicsmartkids-rg -o table

# Ver logs del backend
az containerapp logs show --name magicsmartkids-backend --resource-group magicsmartkids-rg --follow

# Ver logs del frontend
az containerapp logs show --name magicsmartkids-frontend --resource-group magicsmartkids-rg --follow
```

## 🔄 Actualizar Aplicación

```bash
# Rebuild y push nueva imagen
docker build -f Dockerfile.backend -t magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest .
docker push magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest

# Actualizar container app
az containerapp update \
    --name magicsmartkids-backend \
    --resource-group magicsmartkids-rg \
    --image magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest
```

## 🗑️ Eliminar Todo

```bash
az group delete --name magicsmartkids-rg --yes --no-wait
```

## 💰 Costos Estimados

- **Container Apps**: ~$30-50/mes
- **MySQL Flexible Server (B1ms)**: ~$15-25/mes
- **Container Registry (Basic)**: ~$5/mes
- **Total estimado**: ~$50-80/mes

## 🔐 Seguridad

- Cambiar contraseñas después del primer deployment
- Configurar firewall rules en MySQL
- Habilitar HTTPS en Container Apps
- Rotar JWT secrets regularmente

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `az containerapp logs show`
2. Verifica el estado: `az containerapp show`
3. Revisa la conexión a MySQL desde el portal de Azure
