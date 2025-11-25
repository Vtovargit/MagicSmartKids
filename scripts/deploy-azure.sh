#!/bin/bash
# ============================================
# Azure Deployment Script for Magic Smart Kids
# ============================================

set -e

echo "========================================"
echo "MAGIC SMART KIDS - AZURE DEPLOYMENT"
echo "========================================"
echo ""

# Configuration
PROJECT_NAME="magicsmartkids"
LOCATION="eastus"
RESOURCE_GROUP="${PROJECT_NAME}-rg"
ACR_NAME="${PROJECT_NAME}acr"
MYSQL_SERVER="${PROJECT_NAME}-mysql"
MYSQL_DB="altius_academy"
MYSQL_USER="altius_admin"
MYSQL_PASSWORD="Altius120994!"
JWT_SECRET="magicsmartkids-jwt-secret-120994"
BACKEND_APP="${PROJECT_NAME}-backend"
FRONTEND_APP="${PROJECT_NAME}-frontend"

echo "[1/10] Logging into Azure..."
az login

echo ""
echo "[2/10] Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo ""
echo "[3/10] Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

echo ""
echo "[4/10] Getting ACR credentials..."
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

echo ""
echo "[5/10] Logging into ACR..."
az acr login --name $ACR_NAME

echo ""
echo "[6/10] Building and pushing Backend image..."
docker build -f Dockerfile.backend -t ${ACR_NAME}.azurecr.io/${PROJECT_NAME}-backend:latest .
docker push ${ACR_NAME}.azurecr.io/${PROJECT_NAME}-backend:latest

echo ""
echo "[7/10] Building and pushing Frontend image..."
docker build -f Dockerfile.frontend -t ${ACR_NAME}.azurecr.io/${PROJECT_NAME}-frontend:latest .
docker push ${ACR_NAME}.azurecr.io/${PROJECT_NAME}-frontend:latest

echo ""
echo "[8/10] Creating MySQL Flexible Server..."
az mysql flexible-server create \
    --resource-group $RESOURCE_GROUP \
    --name $MYSQL_SERVER \
    --location $LOCATION \
    --admin-user $MYSQL_USER \
    --admin-password $MYSQL_PASSWORD \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --storage-size 32 \
    --version 8.0.21 \
    --public-access 0.0.0.0-255.255.255.255

echo ""
echo "Creating database..."
az mysql flexible-server db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $MYSQL_SERVER \
    --database-name $MYSQL_DB

echo ""
echo "[9/10] Creating Container Apps Environment..."
az containerapp env create \
    --name ${PROJECT_NAME}-env \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION

echo ""
echo "Creating Backend Container App..."
MYSQL_HOST=$(az mysql flexible-server show --resource-group $RESOURCE_GROUP --name $MYSQL_SERVER --query "fullyQualifiedDomainName" -o tsv)

az containerapp create \
    --name $BACKEND_APP \
    --resource-group $RESOURCE_GROUP \
    --environment ${PROJECT_NAME}-env \
    --image ${ACR_NAME}.azurecr.io/${PROJECT_NAME}-backend:latest \
    --target-port 8080 \
    --ingress external \
    --registry-server ${ACR_NAME}.azurecr.io \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --env-vars \
        "SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQL_HOST}:3306/${MYSQL_DB}?useSSL=true&requireSSL=false" \
        "SPRING_DATASOURCE_USERNAME=${MYSQL_USER}" \
        "SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}" \
        "JWT_SECRET=${JWT_SECRET}" \
    --cpu 1.0 \
    --memory 2.0Gi

echo ""
echo "[10/10] Creating Frontend Container App..."
BACKEND_URL=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv)

az containerapp create \
    --name $FRONTEND_APP \
    --resource-group $RESOURCE_GROUP \
    --environment ${PROJECT_NAME}-env \
    --image ${ACR_NAME}.azurecr.io/${PROJECT_NAME}-frontend:latest \
    --target-port 80 \
    --ingress external \
    --registry-server ${ACR_NAME}.azurecr.io \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --env-vars "VITE_API_URL=https://${BACKEND_URL}" \
    --cpu 0.5 \
    --memory 1.0Gi

echo ""
echo "========================================"
echo "DEPLOYMENT COMPLETED!"
echo "========================================"
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv)
echo ""
echo "Frontend URL: https://${FRONTEND_URL}"
echo "Backend URL: https://${BACKEND_URL}"
echo ""
echo "MySQL Server: ${MYSQL_HOST}"
echo "Database: ${MYSQL_DB}"
echo "Username: ${MYSQL_USER}"
echo ""
echo "========================================"
