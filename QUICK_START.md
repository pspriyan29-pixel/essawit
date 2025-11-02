# Quick Start Guide

## Menjalankan Aplikasi di Port 7777

### 1. Install Dependencies (Jika Belum)

```bash
# Install semua dependencies
npm run install:all

# Atau install secara manual:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Setup Backend

Pastikan Anda sudah membuat file `.env` di folder `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sawit_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:7777
NODE_ENV=development
```

**Penting**: Pastikan MongoDB sudah berjalan!

### 3. Jalankan Aplikasi

#### Opsi A: Jalankan Bersama (Recommended)

```bash
npm run dev
```

Ini akan menjalankan backend di port 5000 dan frontend di port 7777.

#### Opsi B: Jalankan Terpisah

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Akses Aplikasi

Buka browser dan akses:
- **Frontend**: http://localhost:7777
- **Backend API**: http://localhost:5000/api/health

### Troubleshooting

**Port 7777 sudah digunakan?**
- Cek aplikasi lain yang menggunakan port 7777
- Atau ubah port di `frontend/vite.config.js`

**Port 5000 sudah digunakan?**
- Ubah `PORT` di `backend/.env`
- Update proxy target di `frontend/vite.config.js`

**MongoDB connection error?**
- Pastikan MongoDB service berjalan
- Periksa `MONGODB_URI` di `.env`
- Untuk MongoDB Atlas, pastikan IP sudah di-whitelist

**Module not found?**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json
cd ../.. && npm run install:all
```

## Struktur Port

- **Frontend**: Port 7777 (bisa diubah di `frontend/vite.config.js`)
- **Backend**: Port 5000 (bisa diubah di `backend/.env`)
- **MongoDB**: Port 27017 (default)

## Verifikasi

1. Backend health check: http://localhost:5000/api/health
2. Frontend: http://localhost:7777
3. Check console untuk error messages

## Next Steps

1. Daftar akun baru di http://localhost:7777/register
2. Login dengan akun yang baru dibuat
3. Mulai menggunakan aplikasi!

