# Deployment Guide - LMS Kampus

## Architecture Overview

- **Frontend**: Vercel (recommended) atau Netlify
- **Backend**: Railway, Render, atau VPS
- **Database**: Supabase (managed PostgreSQL)
- **Storage**: Supabase Storage
- **Redis**: Upstash (managed Redis)

## 1. Deploy Backend ke Railway

### Setup Railway
1. Buat akun di https://railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`

### Deploy
```bash
cd backend

# Initialize Railway project
railway init

# Add environment variables
railway variables set DATABASE_URL="your-supabase-pooling-url"
railway variables set DIRECT_URL="your-supabase-direct-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set JWT_REFRESH_SECRET="your-refresh-secret"
railway variables set SUPABASE_URL="your-supabase-url"
railway variables set SUPABASE_ANON_KEY="your-anon-key"
railway variables set SUPABASE_SERVICE_KEY="your-service-key"
railway variables set REDIS_URL="your-upstash-redis-url"
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"

# Deploy
railway up

# Run migrations
railway run npm run prisma:migrate:deploy

# Seed database
railway run npm run prisma:seed
```

Railway akan memberikan URL backend, contoh: `https://lms-backend.railway.app`

## 2. Setup Upstash Redis

1. Buat akun di https://upstash.com
2. Create new database
3. Pilih region terdekat
4. Copy **REST URL** → gunakan sebagai `REDIS_URL`

## 3. Deploy Frontend ke Vercel

### Setup Vercel
1. Buat akun di https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`

### Deploy
```bash
cd frontend

# Login
vercel login

# Deploy
vercel

# Set environment variables di Vercel Dashboard:
# - NEXT_PUBLIC_API_URL = https://lms-backend.railway.app/api/v1
# - NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
# - NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
# - NEXTAUTH_SECRET = your-nextauth-secret
# - NEXTAUTH_URL = https://your-app.vercel.app

# Deploy production
vercel --prod
```

## 4. Alternative: Deploy ke VPS

### Requirements
- Ubuntu 22.04 LTS
- 2GB RAM minimum
- Node.js 18+
- Nginx
- PM2

### Setup VPS
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Clone repository
git clone <your-repo-url>
cd lms-kampus

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials production
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed

# Start backend dengan PM2
pm2 start src/index.js --name lms-backend
pm2 save
pm2 startup

# Setup frontend
cd ../frontend
npm install
npm run build

# Start frontend dengan PM2
pm2 start npm --name lms-frontend -- start
pm2 save
```

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/lms
```

```nginx
# Backend
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

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL dengan Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

## 5. Setup CI/CD dengan GitHub Actions

Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 6. Monitoring & Maintenance

### Setup Monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Uptime Robot**: Uptime monitoring

### Backup Strategy
- Supabase auto-backup (daily)
- Manual backup: `pg_dump` via Supabase dashboard
- Store backups di S3/R2

### Performance Optimization
- Enable Supabase connection pooling
- Use Redis caching aggressively
- Optimize images dengan Next.js Image
- Enable Vercel Edge Functions untuk API routes

## Cost Estimation (Monthly)

**Free Tier:**
- Supabase: $0 (500MB database, 1GB storage)
- Vercel: $0 (hobby plan)
- Railway: $5 (500 hours)
- Upstash: $0 (10K commands/day)
**Total: ~$5/month**

**Production (Small Scale):**
- Supabase Pro: $25
- Vercel Pro: $20
- Railway: $20
- Upstash Pro: $10
**Total: ~$75/month**

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Setup rate limiting
- [ ] Enable CORS properly
- [ ] Use HTTPS everywhere
- [ ] Setup firewall rules
- [ ] Enable 2FA for all admin accounts
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Monitor logs for suspicious activity

## Support

Untuk bantuan deployment, buka issue di repository atau hubungi tim development.
