import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Explicitly set base path
  server: {
    port: 7777,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    // Note: CSP headers in dev server may not work as expected
    // For production, set CSP in your server (nginx, Apache, etc.)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // Ensure proper path resolution
    emptyOutDir: true,
  },
  preview: {
    port: 7777,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
