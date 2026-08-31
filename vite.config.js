import { defineConfig } from 'vite'
import { devSharePlugin } from './scripts/devShare.mjs'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), devSharePlugin()],
  server: {
    // Friends-beta tunneling (2026-08-26): cloudflared/ngrok URLs arrive with
    // their own hostnames — accept them (dev server only, never deployed).
    allowedHosts: true,
    // DEV: the frontend calls auth same-origin (src/auth/api.js) and the dev
    // server relays to prod — so sign-in works from ANY device on the LAN
    // (phones hit CORS walls calling prod directly from http://192.168.x.x).
    proxy: {
      '/auth': { target: 'https://nyc-stoop.vercel.app', changeOrigin: true },
      '/feedback': { target: 'https://nyc-stoop.vercel.app', changeOrigin: true },
    },
  },
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
