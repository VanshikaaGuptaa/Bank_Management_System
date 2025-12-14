// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All requests starting with /api will be proxied to your backend on 9191
      '/api': {
        target: 'http://localhost:9191',
        changeOrigin: true,
        // If your backend endpoints DO NOT include the '/api' prefix (e.g., '/rm/temp-bank-managers'),
        // uncomment the line below to strip '/api' from the path when forwarding:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
