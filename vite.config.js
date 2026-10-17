import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      {
        name: 'root-main-redirect',
        resolveId(id) {
          if (
            id === '/main.jsx' ||
            id === '/main.js' ||
            id === '/main.tsx' ||
            id === '/main.jxs' ||
            id === 'main.jsx' ||
            id === 'main.js' ||
            id === 'main.tsx' ||
            id === 'main.jxs'
          ) {
            return path.resolve(__dirname, 'src/main.jsx');
          }
        },
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url) {
              const urlNoQuery = req.url.split('?')[0];
              const query = req.url.includes('?') ? '?' + req.url.split('?').slice(1).join('?') : '';
              if (
                urlNoQuery === '/main.jsx' ||
                urlNoQuery === '/main.js' ||
                urlNoQuery === '/main.tsx' ||
                urlNoQuery === '/main.jxs'
              ) {
                req.url = '/src/main.jsx' + query;
              }
            }
            next();
          });
        },
      },
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '/main.jsx': path.resolve(__dirname, 'src/main.jsx'),
        '/main.js': path.resolve(__dirname, 'src/main.jsx'),
        '/main.tsx': path.resolve(__dirname, 'src/main.jsx'),
        '/main.jxs': path.resolve(__dirname, 'src/main.jsx'),
      },
    },
    server: {
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
