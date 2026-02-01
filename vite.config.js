import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sporcle-quiz/',  // GitHub Pages base path
  server: {
    host: '0.0.0.0',  // Expose to local network for mobile access
    port: 5173
  }
})
