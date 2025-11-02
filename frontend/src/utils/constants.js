/**
 * Application Constants
 */

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const PERIOD_TYPES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const PERIOD_TYPE_LABELS = {
  [PERIOD_TYPES.WEEKLY]: 'Mingguan',
  [PERIOD_TYPES.MONTHLY]: 'Bulanan',
  [PERIOD_TYPES.YEARLY]: 'Tahunan',
};

export const EDUCATION_CATEGORIES = {
  PEMUPUKAN: 'pemupukan',
  PANEN: 'panen',
  PENGOLAHAN: 'pengolahan',
  PENGENDALIAN_HAMA: 'pengendalian-hama',
  BUDIDAYA: 'budidaya',
  PEMASARAN: 'pemasaran',
  LAINNYA: 'lainnya',
};

export const EDUCATION_CATEGORY_LABELS = {
  [EDUCATION_CATEGORIES.PEMUPUKAN]: 'Pemupukan',
  [EDUCATION_CATEGORIES.PANEN]: 'Panen',
  [EDUCATION_CATEGORIES.PENGOLAHAN]: 'Pengolahan',
  [EDUCATION_CATEGORIES.PENGENDALIAN_HAMA]: 'Pengendalian Hama',
  [EDUCATION_CATEGORIES.BUDIDAYA]: 'Budidaya',
  [EDUCATION_CATEGORIES.PEMASARAN]: 'Pemasaran',
  [EDUCATION_CATEGORIES.LAINNYA]: 'Lainnya',
};

export const EDUCATION_LEVELS = {
  PEMULA: 'pemula',
  MENENGAH: 'menengah',
  LANJUTAN: 'lanjutan',
};

export const EDUCATION_LEVEL_LABELS = {
  [EDUCATION_LEVELS.PEMULA]: 'Pemula',
  [EDUCATION_LEVELS.MENENGAH]: 'Menengah',
  [EDUCATION_LEVELS.LANJUTAN]: 'Lanjutan',
};

export const SCHOLARSHIP_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const SCHOLARSHIP_STATUS_LABELS = {
  [SCHOLARSHIP_STATUS.PENDING]: 'Menunggu',
  [SCHOLARSHIP_STATUS.REVIEWING]: 'Sedang Ditinjau',
  [SCHOLARSHIP_STATUS.ACCEPTED]: 'Diterima',
  [SCHOLARSHIP_STATUS.REJECTED]: 'Ditolak',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    DASHBOARD: '/users/dashboard',
    CHANGE_PASSWORD: '/users/change-password',
  },
  HARVEST: {
    LIST: '/harvest',
    STATISTICS: '/harvest/statistics',
    DETAIL: (id) => `/harvest/${id}`,
  },
  SUBSCRIPTION: {
    PLANS: '/subscription/plans',
    SUBSCRIBE: '/subscription/subscribe',
    MY_SUBSCRIPTION: '/subscription/my-subscription',
  },
  EDUCATION: {
    LIST: '/education',
    DETAIL: (id) => `/education/${id}`,
    PROGRESS: '/education/progress',
    MY_PROGRESS: '/education/progress/my',
  },
  SCHOLARSHIP: {
    LIST: '/scholarship',
    DETAIL: (id) => `/scholarship/${id}`,
    APPLY: (id) => `/scholarship/${id}/apply`,
    MY_APPLICATIONS: '/scholarship/applications/my',
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  FULL: 'dd MMMM yyyy',
  DATETIME: 'dd MMM yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki izin untuk mengakses resource ini.',
  NOT_FOUND: 'Data yang Anda cari tidak ditemukan.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak terduga.',
};

export const SUCCESS_MESSAGES = {
  SAVED: 'Data berhasil disimpan.',
  UPDATED: 'Data berhasil diperbarui.',
  DELETED: 'Data berhasil dihapus.',
  CREATED: 'Data berhasil dibuat.',
  LOGIN: 'Login berhasil!',
  REGISTER: 'Registrasi berhasil!',
  LOGOUT: 'Logout berhasil.',
  PASSWORD_CHANGED: 'Password berhasil diubah.',
  PROFILE_UPDATED: 'Profil berhasil diperbarui.',
};

