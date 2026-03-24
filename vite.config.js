import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Inline assets under 50KB as base64 (ensures college logo is embedded)
    assetsInlineLimit: 50 * 1024,
  },
})
