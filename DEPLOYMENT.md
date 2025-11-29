# POS System Deployment Guide

## Option 1: VPS Deployment (Recommended)

### Requirements
- VPS with Node.js 18+ support (Hostinger VPS, DigitalOcean, Linode, etc.)
- At least 1GB RAM
- Ubuntu 22.04 LTS recommended

### Step 1: Prepare Production Build

```bash
# On your local machine
cd /path/to/pos

# Build the client
cd packages/client
npm run build

# The build files will be in packages/client/dist
```

### Step 2: Server Setup (on VPS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 3: Upload Files

Upload these to your VPS:
- `packages/server/` folder
- `packages/client/dist/` folder
- `package.json` (root)

### Step 4: Server Configuration

Create `/var/www/pos/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'pos-server',
    script: 'src/index.ts',
    interpreter: 'npx',
    interpreter_args: 'ts-node',
    cwd: '/var/www/pos/packages/server',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      JWT_SECRET: 'your-super-secret-key-change-this'
    }
  }]
};
```

### Step 5: Nginx Configuration

Create `/etc/nginx/sites-available/pos`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React)
    location / {
        root /var/www/pos/packages/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded files
    location /uploads {
        proxy_pass http://localhost:3001/uploads;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/pos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Start the Application

```bash
cd /var/www/pos
npm install
cd packages/server
npx prisma generate
npx prisma migrate deploy
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Option 2: Free/Low-Cost Cloud Platforms

### Railway.app (Recommended for beginners)
- Free tier available
- Easy deployment from GitHub
- Supports Node.js + SQLite/PostgreSQL

### Render.com
- Free tier for web services
- Auto-deploy from GitHub
- Good for small projects

### Vercel + PlanetScale
- Vercel for frontend (free)
- PlanetScale for database (free tier)
- Requires separating frontend/backend

---

## Option 3: Hostinger Shared Hosting (Limited)

Only works for the **frontend** - you'd need to host the backend elsewhere.

### Steps:
1. Build the React frontend
2. Upload `dist/` folder to public_html
3. Host backend on Railway/Render (free)
4. Update API URLs in frontend

---

## Environment Variables

Create `.env` file for production:

```env
# Server
NODE_ENV=production
PORT=3001
JWT_SECRET=your-very-long-random-secret-key-here

# Database (if using PostgreSQL instead of SQLite)
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## Database Migration for Production

If switching from SQLite to PostgreSQL:

1. Update `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migrations:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Set up firewall (ufw)
- [ ] Regular backups of database
- [ ] Update dependencies regularly

---

## Quick Deploy to Railway (Easiest)

1. Push your code to GitHub
2. Go to railway.app
3. Create new project → Deploy from GitHub
4. Select your repo
5. Add environment variables
6. Deploy!

Railway will automatically detect Node.js and deploy both frontend and backend.

