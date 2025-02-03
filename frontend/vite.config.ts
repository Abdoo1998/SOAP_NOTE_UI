import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: 'react'
  })],
  server: {
    port: 5173,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'auth': ['./src/hooks/useAuth.tsx', './src/utils/authUtils.ts'],
          'ui-components': ['./src/components/layout/Header.tsx', './src/components/layout/Sidebar.tsx'],
          'pages': ['./src/pages/Login.tsx', './src/pages/Signup.tsx']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});