# 🚀 NusaPalma Setup Guide

Panduan lengkap untuk setup environment variables, MongoDB, dan menjalankan aplikasi.

## 📋 Prerequisites

1. **Node.js** (v16 atau lebih tinggi)
   - Download: https://nodejs.org/
   - Verifikasi: `node --version`

2. **MongoDB** (v4.4 atau lebih tinggi)
   - Download: https://www.mongodb.com/try/download/community
   - Verifikasi: `mongod --version`

3. **npm** (terinstall dengan Node.js)
   - Verifikasi: `npm --version`

## 🔧 Setup Environment Variables

### 1. Backend Environment Variables

1. **Copy file contoh:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Edit file `.env` dan isi dengan nilai berikut:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:7777

   # Database Configuration
   # Untuk MongoDB lokal:
   MONGODB_URI=mongodb://localhost:27017/sawit_db
   
   # Untuk MongoDB Atlas (Cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sawit_db

   # JWT Configuration
   # GENERATE SECRET: openssl rand -base64 32
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d

   # Rate Limiting
   RATE_LIMIT_MAX=100
   ```

3. **Generate JWT Secret (PENTING untuk production):**
   ```bash
   openssl rand -base64 32
   ```
   Copy hasilnya ke `JWT_SECRET` di file `.env`

### 2. Frontend Environment Variables

1. **Copy file contoh:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edit file `.env` dan isi dengan nilai berikut:**
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5000/api

   # Google OAuth Configuration
   # Dapatkan Client ID dari: https://console.cloud.google.com/
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

   # Facebook OAuth Configuration
   # Dapatkan App ID dari: https://developers.facebook.com/
   VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
   ```

### 3. Setup Google OAuth

1. **Buka Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Buat project baru atau pilih project yang ada**

3. **Enable Google+ API:**
   - APIs & Services → Library
   - Cari "Google+ API" dan enable

4. **Create OAuth 2.0 Credentials:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:7777`
   - Authorized redirect URIs: `http://localhost:7777`

5. **Copy Client ID ke `.env`:**
   ```env
   VITE_GOOGLE_CLIENT_ID=paste_client_id_di_sini
   ```

### 4. Setup Facebook OAuth

1. **Buka Facebook Developers:**
   - https://developers.facebook.com/

2. **Buat app baru:**
   - My Apps → Create App
   - Pilih "Consumer" atau "Business"
   - Isi detail app

3. **Add Facebook Login:**
   - Dashboard → Add Product → Facebook Login
   - Setup → Valid OAuth Redirect URIs: `http://localhost:7777`

4. **Copy App ID ke `.env`:**
   ```env
   VITE_FACEBOOK_APP_ID=paste_app_id_di_sini
   ```

## 🗄️ Setup MongoDB

### Opsi 1: MongoDB Lokal

1. **Install MongoDB:**
   - Download: https://www.mongodb.com/try/download/community
   - Install sesuai sistem operasi Anda

2. **Start MongoDB:**
   ```bash
   # Windows (Service)
   net start MongoDB

   # Windows (Manual)
   mongod

   # Linux/Mac
   sudo systemctl start mongod
   # atau
   mongod
   ```

3. **Verifikasi MongoDB berjalan:**
   ```bash
   mongosh
   # atau
   mongo
   ```

4. **Update `.env` backend:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/sawit_db
   ```

### Opsi 2: MongoDB Atlas (Cloud)

1. **Daftar di MongoDB Atlas:**
   - https://www.mongodb.com/cloud/atlas

2. **Buat cluster gratis**

3. **Create Database User:**
   - Database Access → Add New Database User
   - Buat username dan password

4. **Whitelist IP:**
   - Network Access → Add IP Address
   - Tambahkan `0.0.0.0/0` untuk akses dari mana saja (untuk development)

5. **Get Connection String:**
   - Clusters → Connect → Connect your application
   - Copy connection string

6. **Update `.env` backend:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sawit_db
   ```
   Ganti `username`, `password`, dan `cluster` dengan nilai Anda.

## ✅ Verification Scripts

### 1. Check Setup Lengkap

```bash
# Dari root directory
node setup-check.js
```

### 2. Check Backend Environment

```bash
cd backend
node scripts/check-env.js
```

### 3. Check MongoDB Connection

```bash
cd backend
node scripts/check-db.js
```

### 4. Check Frontend Environment

```bash
cd frontend
node scripts/check-env.js
```

## 🚀 Running the Application

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start MongoDB (jika menggunakan lokal)

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 3. Start Backend

```bash
cd backend
npm start
```

Backend akan berjalan di: `http://localhost:5000`

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di: `http://localhost:7777`

## 🔍 Troubleshooting

### MongoDB Connection Failed

1. **Check MongoDB berjalan:**
   ```bash
   mongosh
   ```

2. **Check connection string:**
   - Pastikan `MONGODB_URI` benar di `.env`
   - Untuk Atlas, pastikan username/password benar
   - Pastikan IP sudah di-whitelist (Atlas)

3. **Check firewall:**
   - Pastikan port 27017 (local) atau 27017 (Atlas) tidak di-block

### Environment Variables Not Working

1. **Restart server setelah mengubah `.env`**

2. **Check file `.env` ada di tempat yang benar:**
   - Backend: `backend/.env`
   - Frontend: `frontend/.env`

3. **Frontend variables harus prefix `VITE_`:**
   ```env
   VITE_API_URL=...
   VITE_GOOGLE_CLIENT_ID=...
   ```

### OAuth Not Working

1. **Check Client ID/App ID sudah di-set di `.env`**

2. **Check authorized URLs di Google/Facebook console:**
   - Harus include `http://localhost:7777`

3. **Check browser console untuk error**

4. **Clear browser cache dan cookies**

## 📝 Notes

- **Development:** Semua environment variables menggunakan default yang aman untuk development
- **Production:** HARUS generate JWT_SECRET yang kuat dan tidak menggunakan default values
- **OAuth:** Google dan Facebook OAuth opsional, aplikasi tetap bisa digunakan tanpa OAuth

## 🆘 Need Help?

Jika masih ada masalah:

1. Run setup checker: `node setup-check.js`
2. Check error logs di console
3. Pastikan semua prerequisites terinstall
4. Pastikan semua environment variables sudah di-set

---

© 2025 NusaPalma - Dibuat oleh Riyan Perdhana Putra

