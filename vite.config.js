import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev Share mock (scripts/devShare.mjs) is imported DYNAMICALLY and only
// for `vite dev` — .vercelignore excludes scripts/ from deployments, and the
// 2026-08-30 Vercel build failed because a top-level import tried to resolve
// it there. Builds must never depend on dev-only files.
export default defineConfig(async ({ command }) => {
  const plugins = [react()]
  if (command === 'serve') {
    // Computed path so esbuild can't statically resolve it while bundling
    // this config (a literal string failed the 2026-08-30 Vercel build even
    // as a dynamic import). Resolved from the project root at runtime.
    try {
      const { pathToFileURL } = await import('node:url')
      const { devSharePlugin } = await import(pathToFileURL(process.cwd() + '/scripts/devShare.mjs').href)
      plugins.push(devSharePlugin())
    } catch (e) {
      console.warn('[dev] Share mock not loaded:', e?.message)
    }
  }
  return {
    plugins,
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
  }
})
