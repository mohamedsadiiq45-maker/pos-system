# POS Deployment Guide for Shared Hosting

## Overview
Since shared hosting doesn't support Node.js, we'll split the deployment:
- **Frontend (Client)** → Your Shared Hosting
- **Backend (Server)** → Railway.app (FREE)

---

## Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign up with GitHub

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account if not already
4. Select this POS repository

### 1.3 Configure the Service
1. After import, click on the service
2. Go to "Settings" tab
3. Set **Root Directory** to: `packages/server`
4. Set **Build Command** to: `npm install && npx prisma generate && npm run build`
5. Set **Start Command** to: `npx prisma migrate deploy && npm start`

### 1.4 Add Environment Variables
Go to "Variables" tab and add:

```
JWT_SECRET=your-super-secret-key-make-it-very-long-and-random-123456
NODE_ENV=production
CLIENT_URL=https://your-domain.com
STOREFRONT_URL=https://store.your-domain.com
```

> ⚠️ **IMPORTANT**: Replace `your-super-secret-key...` with a real random string!

### 1.5 Deploy
1. Click "Deploy" 
2. Wait for build to complete (2-3 minutes)
3. Go to "Settings" → "Networking" → "Generate Domain"
4. Copy your Railway URL (e.g., `https://pos-server-abc123.railway.app`)

---

## Step 2: Build Frontend with Railway URL

### 2.1 Create Environment File
Create a file `packages/client/.env.production`:

```
VITE_API_URL=https://your-railway-url.railway.app
```

Replace with YOUR actual Railway URL from Step 1.5

### 2.2 Build the Frontend
```bash
cd packages/client
npm run build
```

This creates a `dist` folder with your production files.

---

## Step 3: Upload to Shared Hosting

### 3.1 Connect to Your Hosting
Use one of these methods:
- **File Manager** in your hosting control panel (cPanel/hPanel)
- **FTP Client** like FileZilla

### 3.2 Upload Files
1. Navigate to `public_html` folder (or `www` or `htdocs`)
2. Delete any existing files (backup first if needed)
3. Upload **all contents** of `packages/client/dist/` folder
   - `index.html`
   - `assets/` folder
   - `.htaccess`
   - `logo.png`, `logo.svg`

### 3.3 Verify
1. Visit your domain
2. You should see the POS login page
3. Try logging in with default credentials:
   - Email: `admin@pos.com`
   - Password: `admin123`

---

## Step 4: Deploy Storefront (Optional)

If you want the customer-facing store:

### 4.1 Create Environment File
Create `packages/storefront/.env.production`:

```
VITE_API_URL=https://your-railway-url.railway.app
```

### 4.2 Build Storefront
```bash
cd packages/storefront
npm run build
```

### 4.3 Upload to Subdomain
1. Create a subdomain in your hosting (e.g., `store.yourdomain.com`)
2. Upload contents of `packages/storefront/dist/` to that subdomain's folder

---

## Troubleshooting

### "Page not found" on refresh
Make sure `.htaccess` file was uploaded and your hosting has `mod_rewrite` enabled.

### API errors / Can't login
1. Check if Railway backend is running (visit your Railway URL directly)
2. Verify `VITE_API_URL` is correct in your `.env.production`
3. Check browser console for CORS errors

### CORS errors
Add your domain to the `CLIENT_URL` environment variable in Railway.

### Images not loading
Images are stored on Railway. Make sure your Railway backend is running.

---

## File Structure After Deployment

```
Shared Hosting (your-domain.com)
├── index.html
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
├── .htaccess
├── logo.png
└── logo.svg

Railway (pos-server-xxx.railway.app)
├── Node.js Server
├── SQLite Database
└── Uploaded Images
```

---

## Updating Your Site

### Update Frontend Only
1. Make changes
2. Run `npm run build` in packages/client
3. Re-upload `dist/` contents to shared hosting

### Update Backend
1. Push changes to GitHub
2. Railway will auto-deploy

---

## Need Help?

- Railway Dashboard: https://railway.app/dashboard
- Check Railway logs for backend errors
- Check browser Console (F12) for frontend errors

