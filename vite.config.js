import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      // Ensure Firebase modules are correctly resolved
      'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app/dist/index.mjs'),
      'firebase/auth': path.resolve(__dirname, 'node_modules/firebase/auth/dist/index.mjs'),
      'firebase/firestore/lite': path.resolve(__dirname, 'node_modules/firebase/firestore/lite/dist/index.mjs'),
      'firebase/storage': path.resolve(__dirname, 'node_modules/firebase/storage/dist/index.mjs')
    }
  },
  build: {
    // Optimize chunks for better loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI libraries chunk
          ui: ['flowbite', 'framer-motion', 'react-icons', 'react-slick', 'slick-carousel', 'swiper'],
          // Firebase separate chunk - specify individual modules
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore/lite', 'firebase/storage'],
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
