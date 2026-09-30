import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev parity with production: nginx proxies /api and /static to the backend,
// so the dev server does the same and the app can always call relative URLs.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/static': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
