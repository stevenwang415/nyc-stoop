import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split the big static payloads out of the main app chunk so a phone on
        // cellular parses less JS before first paint, and data-only updates
        // don't bust the cached app code (and vice versa).
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/src/data/')) return 'data'
        },
      },
    },
  },
})
