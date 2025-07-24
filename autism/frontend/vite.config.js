import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: '/autism/', // Change this to your repository name if needed
  server: {
    port: 8001,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
})
