# Deployment Guide

## Pre-Deployment Checklist

- [ ] Update version number
- [ ] Update CHANGELOG.md
- [ ] Run all tests
- [ ] Build frontend (`npm run build`)
- [ ] Test production build locally
- [ ] Update environment variables
- [ ] Database backup
- [ ] Review security settings

## Environment Variables (Production)

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sawit_db
JWT_SECRET=your_very_secure_random_string_min_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
```

### Frontend (Production Build)

Update `vite.config.js` if needed for production base URL.

## Deployment Options

### Option 1: Traditional VPS

#### Backend
1. Setup Node.js on server
2. Install MongoDB
3. Clone repository
4. Install dependencies: `npm install --production`
5. Setup PM2:
```bash
npm install -g pm2
pm2 start backend/server.js --name sawit-backend
pm2 save
pm2 startup
```
6. Setup Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend
1. Build frontend:
```bash
cd frontend
npm run build
```
2. Serve with Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

### Option 2: Cloud Platforms

#### Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add MongoDB addon: `heroku addons:create mongolab:sandbox`
5. Set environment variables: `heroku config:set JWT_SECRET=...`
6. Deploy: `git push heroku main`

#### Vercel (Frontend)
1. Install Vercel CLI
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Railway
1. Connect GitHub repository
2. Setup environment variables
3. Deploy automatically

### Option 3: Docker

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: sawit_db
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/sawit_db
    depends_on:
      - mongodb
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Deploy: `docker-compose up -d`

## SSL/HTTPS Setup

### Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Database Backup

### Automated Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/sawit_db" --out=/backup/$DATE
```

### Restore
```bash
mongorestore --uri="mongodb://localhost:27017/sawit_db" /backup/20240101_120000
```

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### Application Monitoring
- Setup error tracking (Sentry)
- Setup analytics (Google Analytics)
- Setup uptime monitoring (UptimeRobot)

## Post-Deployment

1. Verify deployment:
   - Check health endpoint: `curl https://api.yourdomain.com/api/health`
   - Test all major features
   - Check error logs

2. Monitor:
   - Server resources (CPU, Memory)
   - Database connections
   - API response times
   - Error rates

3. Update DNS records
4. Enable CDN if needed
5. Setup email notifications for errors

## Rollback

If issues occur:
1. Revert code: `git revert HEAD`
2. Rebuild: `npm run build`
3. Redeploy: `pm2 restart sawit-backend`
4. Restore database if needed

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Database optimization weekly
- Security audit monthly
- Backup verification weekly
- Log rotation daily

### Performance Optimization
- Database indexing
- Query optimization
- Caching strategies
- CDN setup
- Image optimization

