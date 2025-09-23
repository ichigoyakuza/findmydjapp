import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          maps: ['leaflet', 'react-leaflet'],
          payments: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    // Optimisations pour Netlify
    reportCompressedSize: false,
    cssCodeSplit: true,
  },
  // Optimisations pour le développement
  server: {
    port: 5173,
    host: true,
    cors: true,
  },
  preview: {
    port: 4173,
    host: true,
    cors: true,
  },
  // Configuration pour la géolocalisation en développement
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  // Optimisation des dépendances
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
