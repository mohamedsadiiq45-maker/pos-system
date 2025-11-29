# 🛒 POS System

A modern Point of Sale system with Admin Dashboard and Customer Storefront.

## 🚀 One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/mohamedsadiiq45-maker/pos-system)

**Click the button above to deploy the backend server instantly!**

---

## ✨ Features

- ✅ Login/Logout with JWT Authentication
- ✅ Manage Categories & Products
- ✅ Process Sales & Returns
- ✅ Manage Suppliers
- ✅ Stock/Inventory Monitoring
- ✅ User Management (Admin, Manager, Cashier)
- ✅ Sales Reports & Analytics
- ✅ Customer Storefront
- ✅ Media Library

---

## 🔑 Default Login

- **Email:** `admin@pos.com`
- **Password:** `admin123`

---

## 🛠️ Local Development

### Prerequisites
- Node.js v18+
- npm

### Setup

```bash
# Install all dependencies
npm install

# Setup database
cd packages/server
npx prisma db push
npx prisma db seed

# Run development servers
cd ../..
npm run dev
```

- **Admin Dashboard:** http://localhost:5173
- **Storefront:** http://localhost:5174
- **API Server:** http://localhost:3001

---

## 📁 Project Structure

```
├── packages/
│   ├── client/      # Admin Dashboard (React)
│   ├── server/      # Backend API (Node.js/Express)
│   └── storefront/  # Customer Store (React)
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

### Quick Deploy:
1. Click the "Deploy to Render" button above
2. Upload `packages/client/dist` to your shared hosting
3. Done!

---

## 📄 License

MIT
