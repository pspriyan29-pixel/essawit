# NusaPalma - Platform Manajemen Sawit

**NusaPalma** - SATU NUSAN, SATU SAWITAN

Platform manajemen sawit lengkap dengan fitur input panen, edukasi, beasiswa, dan sistem langganan.

© 2025 Dibuat oleh **Riyan Perdhana Putra**

## Fitur Utama

### 🔐 Authentication & Security
- Login dan Register dengan validasi
- JWT Authentication
- Password hashing dengan bcrypt
- Rate limiting
- Helmet security headers

### 📊 Dashboard & Statistik
- Dashboard lengkap dengan statistik pendapatan
- Grafik pendapatan bulanan dan tahunan
- Total panen dan volume
- Statistik real-time

### 💰 Manajemen Panen
- Input pendapatan panen (mingguan, bulanan, tahunan)
- History panen dengan filter dan pagination
- Statistik panen lengkap
- Export data (untuk premium)

### 📚 Edukasi Sawit
- Materi pembelajaran sawit lengkap
- Kategori: Pemupukan, Panen, Pengolahan, dll
- Level: Pemula, Menengah, Lanjutan
- Tracking progress belajar
- Video dan konten premium

### 🎓 Beasiswa Khusus Sawit
- Informasi beasiswa untuk petani sawit
- Pendaftaran beasiswa
- Tracking aplikasi beasiswa
- Filter dan search

### 💳 Sistem Langganan
- Paket: Free, Basic, Premium, Enterprise
- Role-based access control
- Fitur dibatasi berdasarkan paket
- Manajemen subscription

### 👤 User Profile & Settings
- Edit profil lengkap
- Ganti password
- Informasi kebun sawit
- Pengaturan akun

## Teknologi

### Backend
- Node.js dengan Express.js
- MongoDB dengan Mongoose
- JWT untuk authentication
- Bcrypt untuk password hashing
- Express Validator
- Helmet & Rate Limiting

### Frontend
- React 18
- React Router DOM
- Vite
- Tailwind CSS
- Framer Motion (animasi)
- React Query
- Recharts (grafik)
- Axios

## Instalasi

### Prerequisites
- Node.js (v16 atau lebih baru)
- MongoDB (local atau cloud)
- npm atau yarn

### Quick Setup

**Untuk setup cepat, gunakan setup checker:**
```bash
node setup-check.js
```

### Manual Setup

1. **Clone repository atau download project**

2. **Setup Backend Environment:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env file dan isi dengan konfigurasi Anda
   ```

3. **Setup Frontend Environment:**
   ```bash
   cd frontend
   # Buat file .env dengan isi:
   # VITE_API_URL=http://localhost:5000/api
   # VITE_GOOGLE_CLIENT_ID=your_google_client_id
   # VITE_FACEBOOK_APP_ID=your_facebook_app_id
   ```

4. **Install dependencies untuk root project:**
   ```bash
   npm install
   ```

5. **Install dependencies untuk backend dan frontend:**
   ```bash
   npm run install:all
   ```

6. **Pastikan MongoDB berjalan:**
   ```bash
   # Check MongoDB connection
   cd backend
   node scripts/check-db.js
   ```

7. **Check environment variables:**
   ```bash
   # Backend
   cd backend
   node scripts/check-env.js
   
   # Frontend
   cd frontend
   node scripts/check-env.js
   ```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Setup environment variables:

Buat file `.env` di folder `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sawit_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

6. Jalankan MongoDB (jika menggunakan local)

7. Jalankan aplikasi:

Dari root project:
```bash
npm run dev
```

Atau jalankan secara terpisah:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

8. Akses aplikasi:
- Frontend: http://localhost:7777
- Backend API: http://localhost:5000

## Struktur Project

```
├── backend/
│   ├── controllers/     # Controller functions
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation middleware
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Utilities (API, etc)
│   │   └── App.jsx      # Main app component
│   └── public/          # Static files
└── package.json         # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### User
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/dashboard` - Dashboard stats

### Harvest
- `POST /api/harvest` - Create harvest record
- `GET /api/harvest` - Get harvests (with filters)
- `GET /api/harvest/statistics` - Get statistics
- `GET /api/harvest/:id` - Get harvest by ID
- `PUT /api/harvest/:id` - Update harvest
- `DELETE /api/harvest/:id` - Delete harvest

### Subscription
- `GET /api/subscription/plans` - Get all plans
- `POST /api/subscription/subscribe` - Subscribe to plan
- `GET /api/subscription/my-subscription` - Get current subscription

### Education
- `GET /api/education` - Get all educations
- `GET /api/education/:id` - Get education detail
- `POST /api/education/progress` - Update progress
- `GET /api/education/progress/my` - Get my progress

### Scholarship
- `GET /api/scholarship` - Get all scholarships
- `GET /api/scholarship/:id` - Get scholarship detail
- `POST /api/scholarship/:id/apply` - Apply scholarship
- `GET /api/scholarship/applications/my` - Get my applications

## Subscription Plans

- **Free**: Input panen dasar, dashboard dasar, materi terbatas
- **Basic** (Rp 50.000/bulan): Semua fitur Free + unlimited input & history, semua materi
- **Premium** (Rp 100.000/bulan): Semua fitur Basic + analitik lanjutan, export data
- **Enterprise** (Rp 250.000/bulan): Semua fitur Premium + multi-user, API access

## Security Features

- JWT token authentication
- Password hashing dengan bcrypt
- Rate limiting (100 requests/15 min)
- Helmet security headers
- CORS protection
- Input validation dengan express-validator

## Development

### Menambah Fitur Baru

1. Buat model di `backend/models/`
2. Buat controller di `backend/controllers/`
3. Buat routes di `backend/routes/`
4. Buat page di `frontend/src/pages/`
5. Update routes di `frontend/src/App.jsx`

## License

MIT License

## Dokumentasi Lengkap

- [INSTALLATION.md](./INSTALLATION.md) - Panduan instalasi lengkap
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Dokumentasi API
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Panduan development
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Panduan kontribusi
- [CHANGELOG.md](./CHANGELOG.md) - Riwayat perubahan

## Fitur Keamanan

- ✅ JWT Authentication dengan refresh token
- ✅ Password hashing dengan bcrypt
- ✅ Input validation & sanitization
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Security headers (Helmet)
- ✅ SQL injection protection (MongoDB)
- ✅ XSS protection
- ✅ CSRF protection ready

## Performa

- ✅ Code splitting untuk optimal loading
- ✅ Lazy loading untuk routes
- ✅ Image optimization ready
- ✅ Database indexing
- ✅ Query optimization
- ✅ Caching dengan React Query
- ✅ Debounced search inputs

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus management
- ✅ Color contrast compliance

## Best Practices

✅ Error Boundary untuk error handling
✅ Loading states untuk semua async operations
✅ Form validation di client dan server
✅ Standardized API responses
✅ Custom hooks untuk reusable logic
✅ Utility functions untuk common operations
✅ Constants untuk magic strings
✅ Proper error messages
✅ Toast notifications untuk user feedback

## Support

Untuk pertanyaan atau bantuan, silakan:
- Buat issue di repository
- Hubungi tim development
- Baca dokumentasi di folder `docs/`

