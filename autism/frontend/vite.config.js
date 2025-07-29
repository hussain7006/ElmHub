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
    allowedHosts: ['autism.baleeg.com', 'localhost'],
    // Configure WebSocket for domain access
    hmr: {
      host: 'autism.baleeg.com',
      port: 80,
      protocol: 'ws'
    }
  },
})
