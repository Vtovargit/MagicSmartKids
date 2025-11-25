# 🚀 Comandos Azure - Magic Smart Kids (Paso a Paso)

## ⚙️ Configuración
```
Proyecto: magicsmartkids
Región: eastus
MySQL Password: Altius120994!
JWT Secret: magicsmartkids-jwt-secret-120994
```

---

## 📋 PASO 1: Login a Azure
```bash
az login
```
*Espera a que se abra el navegador y completa el login*

---

## 📋 PASO 2: Crear Resource Group
```bash
az group create --name magicsmartkids-rg --location eastus
```

---

## 📋 PASO 3: Crear Container Registry
```bash
az acr create --resource-group magicsmartkids-rg --name magicsmartkidsacr --sku Basic --admin-enabled true
```

---

## 📋 PASO 4: Login al Container Registry
```bash
az acr login --name magicsmartkidsacr
```

---

## 📋 PASO 5: Build y Push Backend
```bash
docker build -f Dockerfile.backend -t magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest .
```

```bash
docker push magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest
```

---

## 📋 PASO 6: Build y Push Frontend
```bash
docker build -f Dockerfile.frontend -t magicsmartkidsacr.azurecr.io/magicsmartkids-frontend:latest .
```

```bash
docker push magicsmartkidsacr.azurecr.io/magicsmartkids-frontend:latest
```

---

## 📋 PASO 7: Crear MySQL Server
```bash
az mysql flexible-server create --resource-group magicsmartkids-rg --name magicsmartkids-mysql --location eastus --admin-user altius_admin --admin-password "Altius120994!" --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 8.0.21 --public-access 0.0.0.0-255.255.255.255
```

---

## 📋 PASO 8: Crear Base de Datos
```bash
az mysql flexible-server db create --resource-group magicsmartkids-rg --server-name magicsmartkids-mysql --database-name altius_academy
```

---

## 📋 PASO 9: Crear Container Apps Environment
```bash
az containerapp env create --name magicsmartkids-env --resource-group magicsmartkids-rg --location eastus
```

---

## 📋 PASO 10: Obtener credenciales ACR
```bash
az acr credential show --name magicsmartkidsacr
```
*Copia el username y password que aparecen*

---

## 📋 PASO 11: Obtener MySQL Host
```bash
az mysql flexible-server show --resource-group magicsmartkids-rg --name magicsmartkids-mysql --query "fullyQualifiedDomainName" -o tsv
```
*Copia el host que aparece (ejemplo: magicsmartkids-mysql.mysql.database.azure.com)*

---

## 📋 PASO 12: Deploy Backend
**IMPORTANTE: Reemplaza [ACR_USERNAME], [ACR_PASSWORD] y [MYSQL_HOST] con los valores que copiaste**

```bash
az containerapp create --name magicsmartkids-backend --resource-group magicsmartkids-rg --environment magicsmartkids-env --image magicsmartkidsacr.azurecr.io/magicsmartkids-backend:latest --target-port 8080 --ingress external --registry-server magicsmartkidsacr.azurecr.io --registry-username [ACR_USERNAME] --registry-password [ACR_PASSWORD] --env-vars "SPRING_DATASOURCE_URL=jdbc:mysql://[MYSQL_HOST]:3306/altius_academy?useSSL=true&requireSSL=false" "SPRING_DATASOURCE_USERNAME=altius_admin" "SPRING_DATASOURCE_PASSWORD=Altius120994!" "JWT_SECRET=magicsmartkids-jwt-secret-120994" --cpu 1.0 --memory 2.0Gi
```

---

## 📋 PASO 13: Obtener Backend URL
```bash
az containerapp show --name magicsmartkids-backend --resource-group magicsmartkids-rg --query "properties.configuration.ingress.fqdn" -o tsv
```
*Copia la URL del backend*

---

## 📋 PASO 14: Deploy Frontend
**IMPORTANTE: Reemplaza [ACR_USERNAME], [ACR_PASSWORD] y [BACKEND_URL] con los valores que copiaste**

```bash
az containerapp create --name magicsmartkids-frontend --resource-group magicsmartkids-rg --environment magicsmartkids-env --image magicsmartkidsacr.azurecr.io/magicsmartkids-frontend:latest --target-port 80 --ingress external --registry-server magicsmartkidsacr.azurecr.io --registry-username [ACR_USERNAME] --registry-password [ACR_PASSWORD] --env-vars "VITE_API_URL=https://[BACKEND_URL]" --cpu 0.5 --memory 1.0Gi
```

---

## 📋 PASO 15: Obtener Frontend URL
```bash
az containerapp show --name magicsmartkids-frontend --resource-group magicsmartkids-rg --query "properties.configuration.ingress.fqdn" -o tsv
```

---

## ✅ VERIFICAR DEPLOYMENT

### Ver todas las apps:
```bash
az containerapp list --resource-group magicsmartkids-rg -o table
```

### Ver logs del backend:
```bash
az containerapp logs show --name magicsmartkids-backend --resource-group magicsmartkids-rg --follow
```

### Ver logs del frontend:
```bash
az containerapp logs show --name magicsmartkids-frontend --resource-group magicsmartkids-rg --follow
```

---

## 🗑️ ELIMINAR TODO (si algo sale mal)
```bash
az group delete --name magicsmartkids-rg --yes --no-wait
```

---

## 💡 TIPS
- Cada comando puede tardar 1-5 minutos
- Si un comando falla, léelo bien y reintenta
- Guarda las URLs que te da al final
- El MySQL puede tardar hasta 10 minutos en crearse
