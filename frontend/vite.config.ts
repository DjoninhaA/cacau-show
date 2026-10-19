import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // API local (npm run dev:api). Na Vercel, /api é a Function em api/index.ts.
    proxy: { '/api': `http://localhost:${process.env.API_PORT ?? 3001}` },
  },
})
