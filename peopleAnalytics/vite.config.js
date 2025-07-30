import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pa/',
  server: {
    port: 8006,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      'people-analytics.baleeg.com',
      'people-analytics.baleeg.com/pa',
      'people-analytics.baleeg.com/pa/',
      'http://150.136.144.219',
      'http://150.136.144.219:8006',
      'http://150.136.144.219:8006/pa',
      'http://150.136.144.219:8006/pa/',
    ],
    hmr: {
      host: 'people-analytics.baleeg.com',
      protocol: 'wss',
    },
  },
 
})
