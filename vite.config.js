import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunks for better loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI libraries chunk
          ui: ['flowbite', 'framer-motion', 'react-icons', 'react-slick', 'slick-carousel', 'swiper'],
          // Firebase separate chunk
          firebase: ['firebase'],
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Generate source maps for production build
    sourcemap: false,
    // Enable asset minification
    minify: 'terser',
    // Terser options
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dev server for HMR
  server: {
    hmr: true,
    port: 3000,
  },
})
