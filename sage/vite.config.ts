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
    allowedHosts: ['sage.baleeg.com', 'localhost'],
  }
})
