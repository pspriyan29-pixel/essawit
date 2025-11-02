# OAuth Setup Guide

## Google OAuth Setup

1. **Buat Project di Google Cloud Console**
   - Kunjungi: https://console.cloud.google.com/
   - Buat project baru atau pilih project yang sudah ada

2. **Enable Google+ API**
   - Pergi ke "APIs & Services" > "Library"
   - Cari "Google+ API" dan aktifkan

3. **Buat OAuth 2.0 Credentials**
   - Pergi ke "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "OAuth client ID"
   - Pilih "Web application"
   - Tambahkan Authorized JavaScript origins:
     - `http://localhost:7777`
     - `http://localhost:5173` (jika menggunakan Vite default port)
   - Tambahkan Authorized redirect URIs:
     - `http://localhost:7777`
     - `http://localhost:5173`
   - Copy "Client ID" yang dihasilkan

4. **Tambahkan ke Environment Variables**
   ```bash
   # Buat file frontend/.env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

## Facebook OAuth Setup

1. **Buat Facebook App**
   - Kunjungi: https://developers.facebook.com/apps/
   - Klik "Create App"
   - Pilih "Consumer" atau "Business" sebagai tipe app
   - Isi informasi dasar app

2. **Tambahkan Facebook Login Product**
   - Di dashboard app, klik "Add Product"
   - Pilih "Facebook Login"
   - Pilih "Web" sebagai platform

3. **Konfigurasi Facebook Login**
   - Pergi ke "Facebook Login" > "Settings"
   - Tambahkan Valid OAuth Redirect URIs:
     - `http://localhost:7777`
     - `http://localhost:5173`
   - Copy "App ID" dari dashboard

4. **Tambahkan ke Environment Variables**
   ```bash
   # Tambahkan ke file frontend/.env
   VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
   ```

## Testing OAuth

1. **Development Mode**
   - Pastikan backend berjalan di `http://localhost:5000`
   - Pastikan frontend berjalan di `http://localhost:7777`
   - Test Google OAuth: Klik tombol "Google" di halaman login/register
   - Test Facebook OAuth: Klik tombol "Facebook" di halaman login/register

2. **Production Mode**
   - Update Authorized JavaScript origins dan Redirect URIs dengan domain production
   - Pastikan environment variables di-set di hosting platform
   - Test OAuth flow di production

## Troubleshooting

### Google OAuth Error: "redirect_uri_mismatch"
- Pastikan redirect URI di Google Console sama dengan URL aplikasi
- Pastikan menggunakan http:// untuk localhost

### Facebook OAuth Error: "Invalid OAuth access token"
- Pastikan App ID sudah benar
- Pastikan Facebook Login sudah diaktifkan di dashboard
- Check Valid OAuth Redirect URIs

### Error: "Provider dan email harus diisi"
- Pastikan OAuth provider mengembalikan email
- Pastikan email tidak kosong dari provider

## Security Notes

- Jangan commit `.env` file ke repository
- Gunakan environment variables di production
- Regularly rotate OAuth credentials
- Monitor OAuth usage di Google Cloud Console dan Facebook Developer Dashboard
