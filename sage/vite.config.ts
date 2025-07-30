import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sage/',
  server: {
    port: 8004,
    host: '0.0.0.0',
    // allowedHosts: ['all'],
    allowedHosts: [
      'localhost',
      'sage.baleeg.com',
      'sage.baleeg.com/sage',
      'sage.baleeg.com/sage/',
      'http://150.136.144.219',
      'http://150.136.144.219:8004',
      'http://150.136.144.219:8004/sage',
      'http://150.136.144.219:8004/sage/',
    ],
    hmr: {
      host: 'sage.baleeg.com',
      protocol: 'wss',
    },
  }
})
