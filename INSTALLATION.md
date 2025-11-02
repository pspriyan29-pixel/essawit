# Panduan Instalasi Web Management Sawit

## Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v16 atau lebih baru)
- **MongoDB** (v4.4 atau lebih baru)
- **npm** atau **yarn**
- **Git** (opsional)

## Langkah Instalasi

### 1. Clone atau Download Project

Jika menggunakan Git:
```bash
git clone <repository-url>
cd essawit
```

### 2. Install Dependencies

Install dependencies untuk semua bagian:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Atau gunakan script otomatis:
```bash
npm run install:all
```

### 3. Setup Environment Variables

Buat file `.env` di folder `backend/` (copy dari `backend/env.example`):

```bash
cd backend
cp env.example .env
```

Edit file `.env` dengan konfigurasi yang sesuai:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sawit_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:7777
NODE_ENV=development
```

**Penting**: Ganti `JWT_SECRET` dengan string rahasia yang panjang (minimal 32 karakter).

### 4. Setup MongoDB

#### Opsi 1: MongoDB Local

Pastikan MongoDB sudah berjalan di sistem Anda:

```bash
# Windows (jika sudah diinstall)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# atau
mongod
```

#### Opsi 2: MongoDB Atlas (Cloud)

1. Daftar di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster gratis
3. Dapatkan connection string
4. Update `MONGODB_URI` di file `.env`

Contoh:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sawit_db
```

### 5. Jalankan Aplikasi

#### Opsi 1: Jalankan Bersama (Recommended)

Dari root project:
```bash
npm run dev
```

Ini akan menjalankan backend dan frontend bersamaan.

#### Opsi 2: Jalankan Terpisah

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

### 6. Akses Aplikasi

- **Frontend**: http://localhost:7777
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Verifikasi Instalasi

1. Pastikan MongoDB berjalan dan terkoneksi
2. Backend server running di port 5000
3. Frontend development server running di port 5173
4. Buka browser dan akses http://localhost:5173
5. Halaman homepage harus muncul

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solusi**:
1. Pastikan MongoDB service berjalan
2. Periksa `MONGODB_URI` di file `.env`
3. Untuk MongoDB Atlas, pastikan IP address sudah di-whitelist

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solusi**:
1. Untuk backend, ubah port di file `.env`:
```env
PORT=5001
```
2. Untuk frontend, ubah port di `frontend/vite.config.js`:
```js
server: {
  port: 7777, // ubah port di sini
}
```
3. Update `FRONTEND_URL` di backend `.env` sesuai dengan port frontend
4. Atau stop aplikasi lain yang menggunakan port tersebut

### Module Not Found

**Error**: `Cannot find module 'xxx'`

**Solusi**:
1. Hapus `node_modules` dan `package-lock.json`
2. Install ulang:
```bash
npm install
```

### CORS Error

**Error**: `CORS policy blocked`

**Solusi**:
1. Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend
2. Restart backend server

## Next Steps

Setelah instalasi berhasil:

1. **Daftar Akun Baru**
   - Akses http://localhost:5173
   - Klik "Daftar Sekarang"
   - Isi form registrasi

2. **Login**
   - Masuk dengan akun yang baru dibuat
   - Dashboard akan muncul

3. **Setup Data Awal** (Opsional)
   - Input data panen pertama
   - Edit profil
   - Explore fitur lainnya

## Production Deployment

Untuk deployment ke production:

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Setup environment variables untuk production
3. Gunakan process manager seperti PM2 untuk Node.js
4. Setup reverse proxy (Nginx/Apache)
5. Enable HTTPS
6. Setup database backup

## Support

Jika mengalami masalah, silakan:
- Periksa console log untuk error
- Periksa dokumentasi di README.md
- Hubungi tim development

