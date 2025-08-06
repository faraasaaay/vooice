import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed proxy configuration since we're connecting directly to hosted API
  server: {
    port: 5173,
    host: true
  },
})
