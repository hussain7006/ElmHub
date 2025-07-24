import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8007,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
  plugins: [react(), tailwindcss(),],
})
