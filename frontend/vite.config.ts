import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true // Enable listening on all addresses
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});