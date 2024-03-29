import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: false
  },
  resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
        '@lib': path.resolve(__dirname, './lib'),
        "@functions": path.resolve(__dirname, './src/lib/functions'),
        "@components": path.resolve(__dirname, './src/lib/components')
    }
  }
})
