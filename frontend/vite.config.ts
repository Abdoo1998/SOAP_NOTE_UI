import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'zustand/middleware', 'use-sync-external-store'],
    exclude: ['lucide-react']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'zustand']
  }
});