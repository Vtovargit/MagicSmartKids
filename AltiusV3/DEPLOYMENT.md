# 🚀 Guía de Despliegue - Altius Academy V3

## 📋 Checklist Pre-Despliegue

### ✅ Base de Datos
- [ ] MySQL 8.0+ instalado y corriendo
- [ ] Base de datos `altiusv3` creada
- [ ] Scripts de datos ejecutados
- [ ] Usuario de BD con permisos completos

### ✅ Backend
- [ ] Java 17+ instalado
- [ ] Maven 3.6+ instalado
- [ ] `application.properties` configurado
- [ ] Puerto 8080 disponible

### ✅ Frontend
- [ ] Node.js 18+ instalado
- [ ] npm instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Puerto 3000 disponible

## 🔧 Configuración de Producción

### 1. Backend - application.properties
```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/altiusv3
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT
jwt.secret=tu_jwt_secret_muy_seguro_aqui
jwt.expiration=86400000

# Servidor
server.port=8080
server.servlet.context-path=/

# CORS
cors.allowed-origins=http://localhost:3000,https://tu-dominio.com

# Logs
logging.level.com.altiusacademy=INFO
logging.level.org.springframework.security=WARN
```

### 2. Frontend - Variables de Entorno
```bash
# .env.production
VITE_API_URL=https://tu-api.com
VITE_APP_NAME=Altius Academy
VITE_APP_VERSION=3.0.0
```

## 🐳 Docker (Opcional)

### Dockerfile Backend
```dockerfile
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/altius-academy-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080
```

### Dockerfile Frontend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: altiusv3
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/altiusv3
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

## ☁️ Despliegue en la Nube

### AWS
1. **RDS**: MySQL database
2. **EC2**: Backend Spring Boot
3. **S3 + CloudFront**: Frontend estático
4. **Route 53**: DNS

### Heroku
```bash
# Backend
heroku create altius-backend
heroku addons:create cleardb:ignite
git subtree push --prefix backend heroku main

# Frontend
heroku create altius-frontend
heroku buildpacks:set https://github.com/mars/create-react-app-buildpack.git
git subtree push --prefix . heroku main
```

### Vercel (Frontend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🔒 Configuración de Seguridad

### SSL/HTTPS
```bash
# Certbot para SSL gratuito
sudo certbot --nginx -d tu-dominio.com
```

### Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8080  # Backend (si es necesario)
sudo ufw enable
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        root /var/www/altius-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoreo

### Health Checks
```bash
# Backend health
curl http://localhost:8080/api/health

# Frontend
curl http://localhost:3000
```

### Logs
```bash
# Backend logs
tail -f /var/log/altius/backend.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Java
      uses: actions/setup-java@v2
      with:
        java-version: '17'
        
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Build Backend
      run: |
        cd backend
        mvn clean package
        
    - name: Build Frontend
      run: |
        npm ci
        npm run build
        
    - name: Deploy
      run: |
        # Tu script de despliegue aquí
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de conexión a BD**
   ```bash
   # Verificar MySQL
   sudo systemctl status mysql
   mysql -u root -p -e "SHOW DATABASES;"
   ```

2. **Puerto ocupado**
   ```bash
   # Verificar puertos
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :3000
   ```

3. **Permisos de archivos**
   ```bash
   # Corregir permisos
   sudo chown -R www-data:www-data /var/www/altius
   sudo chmod -R 755 /var/www/altius
   ```

4. **CORS errors**
   - Verificar configuración CORS en backend
   - Actualizar URLs permitidas

## 📞 Soporte

Para problemas de despliegue:
1. Revisar logs del sistema
2. Verificar configuraciones
3. Consultar documentación oficial
4. Contactar al equipo de desarrollo

---

**¡Despliegue exitoso! 🎉**