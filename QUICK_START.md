# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan aplikasi NusaPalma.

## ⚡ Setup Cepat (5 Menit)

### 1. Install Dependencies

```bash
# Install semua dependencies
npm run install:all
```

### 2. Setup Environment Variables

**Backend:**
```bash
cd backend
cp env.example .env
# Edit .env file jika perlu (default sudah OK untuk development)
```

**Frontend:**
```bash
cd frontend
# Buat file .env dengan isi minimal:
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 3. Start MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# atau
mongod
```

### 4. Verifikasi Setup

```bash
# Check semua setup
node setup-check.js

# Check backend environment
cd backend && node scripts/check-env.js

# Check MongoDB connection
cd backend && node scripts/check-db.js
```

### 5. Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Akses Aplikasi

- Frontend: http://localhost:7777
- Backend API: http://localhost:5000/api

## ✅ Checklist Setup

- [ ] Node.js terinstall (v16+)
- [ ] MongoDB terinstall dan berjalan
- [ ] Backend `.env` file dibuat dan dikonfigurasi
- [ ] Frontend `.env` file dibuat
- [ ] Dependencies terinstall
- [ ] MongoDB connection berhasil
- [ ] Backend berjalan di port 5000
- [ ] Frontend berjalan di port 7777

## 🔧 Troubleshooting

### MongoDB Connection Failed

```bash
# Check MongoDB berjalan
mongosh

# Test connection
cd backend
node scripts/check-db.js
```

### Environment Variables Not Working

```bash
# Check backend env
cd backend
node scripts/check-env.js

# Check frontend env
cd frontend
node scripts/check-env.js
```

### Dependencies Not Installed

```bash
# Install all
npm run install:all

# Or manually
cd backend && npm install
cd ../frontend && npm install
```

## 📚 Dokumentasi Lengkap

Untuk setup lengkap dengan OAuth dan konfigurasi production, lihat:
- **SETUP_GUIDE.md** - Panduan lengkap setup

## 🆘 Masalah?

Run setup checker:
```bash
node setup-check.js
```

---

© 2025 NusaPalma - Dibuat oleh Riyan Perdhana Putra
