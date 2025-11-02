# 🔧 Fix 404 Error di Vercel

## Masalah
Aplikasi berjalan di localhost tapi 404 Not Found di Vercel.

## ✅ Solusi yang Sudah Diterapkan

### 1. Konfigurasi Vercel (`frontend/vercel.json`)
- ✅ Routing rewrite untuk SPA (Semua route → `/index.html`)
- ✅ Headers untuk security dan caching
- ✅ Build command dan output directory sudah benar

### 2. Vite Configuration (`frontend/vite.config.js`)
- ✅ Base path: `/` (explicit)
- ✅ Build output: `dist`
- ✅ Assets directory: `assets`

### 3. Hapus `vercel.json` di Root
- ✅ Hanya gunakan `frontend/vercel.json` untuk deployment

---

## 📋 Checklist Setup di Vercel Dashboard

### Settings Project di Vercel:

1. **Root Directory**: `frontend` ⚠️ **PENTING!**
2. **Framework Preset**: `Vite` atau `Other`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Environment Variables:
```
VITE_API_URL=https://your-backend.railway.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

---

## 🔍 Troubleshooting

### Jika Masih 404:

#### 1. Cek Build Logs di Vercel
- Buka Project → Deployments → Latest
- Cek Build Logs
- Pastikan tidak ada error
- Pastikan `dist` folder terbentuk

#### 2. Cek File Structure
Setelah build, harus ada:
```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
  └── ...
```

#### 3. Test Build Lokal
```bash
cd frontend
npm run build
ls dist/
```
Pastikan `dist/index.html` ada.

#### 4. Cek Vercel Settings
- Root Directory: **`frontend`** (bukan root!)
- Output Directory: **`dist`**
- Build Command: **`npm run build`**

#### 5. Cek Browser Console
- Buka Developer Tools → Console
- Cek apakah ada error loading assets
- Cek apakah `index.html` ter-load

---

## 🚀 Langkah Deploy Ulang

1. **Pastikan semua file sudah di-push ke GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel 404: Update vercel.json configuration"
   git push
   ```

2. **Di Vercel Dashboard**:
   - Settings → General → Root Directory: `frontend`
   - Settings → General → Build & Output Settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Redeploy atau tunggu auto-deploy dari GitHub

3. **Cek Deployment**
   - Buka Deployment → Check logs
   - Pastikan build success
   - Test di production URL

---

## ✅ Verifikasi

Setelah deploy, cek:

1. ✅ Homepage (`/`) → Muncul
2. ✅ Login (`/login`) → Muncul
3. ✅ Register (`/register`) → Muncul
4. ✅ Assets loading (CSS, JS) → Tidak 404
5. ✅ Browser Console → Tidak ada error

---

## 💡 Tips

1. **Selalu set Root Directory**: `frontend` di Vercel
2. **Gunakan `frontend/vercel.json`**: Jangan pakai root `vercel.json`
3. **Test build lokal**: `npm run build` sebelum deploy
4. **Cek build logs**: Pastikan tidak ada error

---

**Jika masih 404 setelah semua langkah ini, kirim screenshot dari:**
- Vercel Build Logs
- Vercel Project Settings (Root Directory)
- Browser Console errors

