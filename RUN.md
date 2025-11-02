# Cara Menjalankan Aplikasi

## ✅ Dependencies Sudah Terinstall!

Dependencies backend dan frontend sudah berhasil diinstall.

## 🚀 Menjalankan Aplikasi

### Pastikan MongoDB Berjalan!

**Jika menggunakan MongoDB Local:**
- Pastikan MongoDB service sudah running
- Atau jalankan: `mongod`

**Jika menggunakan MongoDB Atlas:**
- Pastikan connection string di `.env` sudah benar

### Jalankan Aplikasi

#### Opsi 1: Jalankan Bersama (Recommended)

Dari root project:
```bash
npm run dev
```

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

## 🌐 Akses Aplikasi

Setelah aplikasi berjalan:
- **Frontend**: http://localhost:7777
- **Backend API**: http://localhost:5000/api/health

## ⚙️ File .env

File `.env` sudah dibuat di `backend/.env`. 

**Jangan lupa ubah JWT_SECRET dengan nilai yang aman!**

Contoh:
```env
JWT_SECRET=my_super_secret_key_12345678901234567890
```

## 🔍 Troubleshooting

### MongoDB Connection Error

Pastikan MongoDB berjalan:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Port Already in Use

Jika port 7777 atau 5000 sudah digunakan:
- Cek aplikasi lain yang menggunakan port tersebut
- Atau ubah port di konfigurasi

### Error "Cannot find module"

Jika masih ada error module:
```bash
# Install ulang dependencies
cd backend
npm install

cd ../frontend
npm install
```

## ✅ Verifikasi

1. **Backend Health Check:**
   - Buka: http://localhost:5000/api/health
   - Harus menampilkan: `{"status":"OK","message":"Server is running"}`

2. **Frontend:**
   - Buka: http://localhost:7777
   - Homepage harus muncul

3. **Console:**
   - Tidak ada error merah
   - Backend log: `✅ MongoDB Connected` dan `🚀 Server running on port 5000`
   - Frontend log: `VITE ready` dengan port 7777

## 📝 Next Steps

1. Buka http://localhost:7777 di browser
2. Klik "Daftar Sekarang" untuk membuat akun baru
3. Login dan mulai menggunakan aplikasi!

