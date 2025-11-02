# Panduan Deployment NusaPalma ke Vercel

## 📋 Persiapan

### 1. Backend Deployment
Karena Vercel fokus pada frontend/static sites, backend perlu di-deploy terpisah ke:
- **Railway** (https://railway.app) - Recommended
- **Render** (https://render.com)
- **Heroku** (https://heroku.com)
- **DigitalOcean App Platform**
- Atau hosting lain yang support Node.js

### 2. Environment Variables yang Diperlukan

#### Frontend (Vercel)
- `VITE_API_URL` - URL backend API (contoh: `https://your-backend.railway.app`)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_FACEBOOK_APP_ID` - Facebook App ID

#### Backend (Railway/Render/Heroku)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `FACEBOOK_APP_ID` - Facebook App ID
- `FACEBOOK_APP_SECRET` - Facebook App Secret
- `PORT` - Port (biasanya auto-set oleh hosting)

---

## 🚀 Deployment Frontend ke Vercel

### Cara 1: Melalui Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```
   
   Atau production deployment:
   ```bash
   vercel --prod
   ```

4. **Setup Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   vercel env add VITE_GOOGLE_CLIENT_ID
   vercel env add VITE_FACEBOOK_APP_ID
   ```

### Cara 2: Melalui Vercel Dashboard

1. **Buka https://vercel.com**
2. **Login dengan GitHub**
3. **Import Project**
   - Pilih repository: `pspriyan29-pixel/essawit`
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Setup Environment Variables**
   - Masuk ke Project Settings → Environment Variables
   - Tambahkan:
     ```
     VITE_API_URL=https://your-backend.railway.app
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     VITE_FACEBOOK_APP_ID=your_facebook_app_id
     ```

5. **Deploy**
   - Klik "Deploy"

---

## 🔧 Setup Backend (Railway - Recommended)

### 1. Deploy Backend ke Railway

1. **Buka https://railway.app**
2. **Login dengan GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Pilih repository**: `pspriyan29-pixel/essawit`
5. **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: (kosongkan, karena tidak perlu build)

6. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-jwt-secret-here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   PORT=5000
   ```

7. **Setup MongoDB**:
   - Railway → New → Database → MongoDB
   - Copy connection string ke `MONGODB_URI`

8. **Deploy & Copy URL**:
   - Railway akan generate URL seperti: `https://your-project.railway.app`
   - Copy URL ini untuk `VITE_API_URL` di Vercel

---

## 🔄 Setup OAuth (Google & Facebook)

### Google OAuth

1. **Google Cloud Console**: https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth 2.0 Client ID**
4. **Authorized JavaScript origins**:
   - `http://localhost:7777` (development)
   - `https://your-app.vercel.app` (production)
5. **Authorized redirect URIs**:
   - `http://localhost:7777` (development)
   - `https://your-app.vercel.app` (production)
6. **Copy Client ID** → tambahkan ke environment variables

### Facebook OAuth

1. **Facebook Developers**: https://developers.facebook.com
2. **Create App** → **Consumer**
3. **Facebook Login** → **Settings**
4. **Valid OAuth Redirect URIs**:
   - `http://localhost:7777` (development)
   - `https://your-app.vercel.app` (production)
5. **Copy App ID** → tambahkan ke environment variables

---

## ✅ Checklist Deployment

### Frontend (Vercel)
- [ ] Deploy frontend ke Vercel
- [ ] Setup environment variables:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_GOOGLE_CLIENT_ID`
  - [ ] `VITE_FACEBOOK_APP_ID`
- [ ] Test aplikasi di production URL

### Backend (Railway/Render)
- [ ] Deploy backend ke hosting
- [ ] Setup MongoDB database
- [ ] Setup environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
  - [ ] `FACEBOOK_APP_ID` & `FACEBOOK_APP_SECRET`
  - [ ] `PORT`
- [ ] Test API endpoints
- [ ] Setup CORS untuk allow Vercel domain

### OAuth Setup
- [ ] Google OAuth:
  - [ ] Setup di Google Cloud Console
  - [ ] Tambahkan authorized origins (Vercel URL)
  - [ ] Tambahkan redirect URIs (Vercel URL)
- [ ] Facebook OAuth:
  - [ ] Setup di Facebook Developers
  - [ ] Tambahkan redirect URIs (Vercel URL)

---

## 🔍 Testing Production

1. **Test Frontend**: `https://your-app.vercel.app`
2. **Test Backend API**: `https://your-backend.railway.app/api/health`
3. **Test OAuth**: Login dengan Google/Facebook
4. **Test Fitur**:
   - [ ] Register/Login
   - [ ] Dashboard
   - [ ] Harvest Input
   - [ ] Education
   - [ ] Scholarship
   - [ ] Profile & Settings

---

## 🐛 Troubleshooting

### CORS Error
- Pastikan backend mengizinkan origin Vercel di CORS settings
- Check `backend/server.js` untuk CORS configuration

### API Connection Error
- Pastikan `VITE_API_URL` di Vercel sudah benar
- Pastikan backend sudah running dan accessible

### OAuth Error
- Pastikan authorized origins/redirect URIs sudah ditambahkan
- Pastikan Client ID/App ID sudah benar di environment variables

### Build Error di Vercel
- Check bahwa `frontend/vercel.json` sudah benar
- Pastikan build command: `npm run build`
- Pastikan output directory: `dist`

---

## 📚 Referensi

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## 💡 Tips

1. **Gunakan custom domain** untuk production (optional)
2. **Setup monitoring** untuk production (Sentry, LogRocket)
3. **Setup analytics** (Google Analytics, Plausible)
4. **Regular backups** untuk MongoDB database
5. **Setup CI/CD** untuk auto-deploy dari GitHub

---

**Selamat! Aplikasi NusaPalma sudah siap untuk production! 🚀**

