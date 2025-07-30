import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/autism/', // Enable base path for domain access
  server: {
    port: 8001,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      'autism.baleeg.com',
      'autism.baleeg.com/autism',
      'autism.baleeg.com/autism/',
      'http://150.136.144.219',
      'http://150.136.144.219:8001',
      'http://150.136.144.219:8001/autism',
      'http://150.136.144.219:8001/autism/',
    ],
    hmr: {
      host: 'autism.baleeg.com',
      protocol: 'wss',
    },
  },
})
