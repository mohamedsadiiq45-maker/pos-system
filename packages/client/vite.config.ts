import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Copy .htaccess to dist for shared hosting
    copyPublicDir: true,
  },
  publicDir: 'public',
})
