import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pa/',
  server: {
    port: 8006,
    host: '0.0.0.0',
    allowedHosts: ['all'],

  },
  plugins: [react()],
})
