# 🚀 Quick Start Deployment - NusaPalma

## Frontend ke Vercel (5 Menit)

### Cara 1: Vercel Dashboard (Paling Mudah)

1. **Buka https://vercel.com** dan login dengan GitHub
2. **New Project** → Import `pspriyan29-pixel/essawit`
3. **Settings**:
   - Root Directory: `frontend`
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_FACEBOOK_APP_ID=your_facebook_app_id
   ```
5. **Deploy** ✅

### Cara 2: Vercel CLI

```bash
npm install -g vercel
cd frontend
vercel login
vercel env add VITE_API_URL
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add VITE_FACEBOOK_APP_ID
vercel --prod
```

---

## Backend ke Railway (5 Menit)

### Setup MongoDB

1. **Buka https://railway.app** → Login dengan GitHub
2. **New Project** → **New** → **Database** → **MongoDB**
3. **Copy connection string** (akan dipakai nanti)

### Deploy Backend

1. **New Service** → **GitHub Repo** → Pilih `essawit`
2. **Settings**:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: (kosongkan)
3. **Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-super-secret-key-here
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   FACEBOOK_APP_ID=...
   FACEBOOK_APP_SECRET=...
   ```
4. **Deploy** → **Copy Public URL** (untuk `VITE_API_URL`)

---

## Setup OAuth (10 Menit)

### Google OAuth

1. https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. **Create OAuth 2.0 Client ID**
4. **Authorized origins**: 
   - `http://localhost:7777`
   - `https://your-app.vercel.app`
5. **Redirect URIs**: sama dengan origins
6. Copy **Client ID** → tambahkan ke environment variables

### Facebook OAuth

1. https://developers.facebook.com
2. **Create App** → **Consumer**
3. **Facebook Login** → **Settings**
4. **Valid OAuth Redirect URIs**:
   - `http://localhost:7777`
   - `https://your-app.vercel.app`
5. Copy **App ID** → tambahkan ke environment variables

---

## ✅ Checklist

### Frontend
- [ ] Deploy ke Vercel
- [ ] Setup `VITE_API_URL` (URL backend)
- [ ] Setup `VITE_GOOGLE_CLIENT_ID`
- [ ] Setup `VITE_FACEBOOK_APP_ID`
- [ ] Test di production URL

### Backend
- [ ] Setup MongoDB di Railway
- [ ] Deploy backend ke Railway
- [ ] Setup semua environment variables
- [ ] Test API: `https://your-backend.railway.app/api/health`
- [ ] Setup CORS untuk allow Vercel domain

### OAuth
- [ ] Google OAuth setup (origins & redirect URIs)
- [ ] Facebook OAuth setup (redirect URIs)
- [ ] Test login dengan Google/Facebook

---

## 🔗 Links Penting

- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **Google Cloud Console**: https://console.cloud.google.com
- **Facebook Developers**: https://developers.facebook.com

---

**Setelah semua selesai, aplikasi Anda akan live di:** `https://your-app.vercel.app` 🎉

