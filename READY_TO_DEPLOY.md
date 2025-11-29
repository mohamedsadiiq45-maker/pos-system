# 🚀 POS System - Ready to Deploy!

Everything is prepared. Follow these steps:

---

## 📁 Files Ready on Your Desktop

| File | What it is | Where to upload |
|------|-----------|-----------------|
| `POS_ADMIN_UPLOAD.zip` | Admin Dashboard (387 KB) | Your main domain `public_html` |
| `POS_STOREFRONT_UPLOAD.zip` | Customer Store (188 KB) | Subdomain (optional) |

---

## Step 1: Deploy Backend to Render.com

1. Go to **[render.com](https://render.com)** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect repo: `mohamedsadiiq45-maker/pos-system`
4. Settings:
   - **Name**: `pos-server`
   - **Root Directory**: `packages/server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `JWT_SECRET` = `your-super-secret-random-key-12345`
   - `NODE_ENV` = `production`

6. Click **"Create Web Service"**
7. Copy your URL (e.g., `https://pos-server-xxxx.onrender.com`)

---

## Step 2: Update Frontend with Your Render URL

⚠️ **IMPORTANT**: Before uploading to hosting, update the API URL!

Edit this file: `packages/client/.env.production`
```
VITE_API_URL=https://YOUR-ACTUAL-RENDER-URL.onrender.com
```

Then rebuild:
```bash
cd ~/Desktop/Pos\ Final/packages/client
npm run build
```

Then re-create the ZIP:
```bash
cd ~/Desktop/Pos\ Final/packages/client/dist
zip -r ~/Desktop/Pos\ Final/POS_ADMIN_UPLOAD.zip . -x "*.DS_Store"
```

---

## Step 3: Upload to Shared Hosting

1. Login to your hosting control panel (cPanel/hPanel)
2. Open **File Manager**
3. Go to `public_html`
4. Delete existing files (backup first!)
5. Upload `POS_ADMIN_UPLOAD.zip`
6. Extract the ZIP
7. Delete the ZIP file after extraction

---

## Step 4: Test Your Site

Visit your domain and login:
- **Email**: `admin@pos.com`
- **Password**: `admin123`

---

## Troubleshooting

### "Page not found" on refresh
Make sure `.htaccess` was uploaded (it's a hidden file)

### Can't login / API errors
- Check Render dashboard - is server running?
- Check browser console (F12) for errors
- Make sure VITE_API_URL is correct

### CORS errors
Add your domain to Render environment variables:
- `CLIENT_URL` = `https://yourdomain.com`

---

## 🎉 You're Done!

Your POS system should now be live at your domain.

