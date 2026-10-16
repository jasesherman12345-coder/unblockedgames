import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'jxs-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url) {
              const cleanUrl = req.url.split('?')[0];
              const query = req.url.includes('?') ? '?' + req.url.split('?').slice(1).join('?') : '';
              if (
                cleanUrl === '/main.jxs' ||
                cleanUrl === '/main.jsx' ||
                cleanUrl === '/main.js' ||
                cleanUrl.endsWith('/main.jxs')
              ) {
                req.url = '/src/main.jsx' + query;
              } else if (req.url.includes('.jxs')) {
                req.url = req.url.replace('.jxs', '.jsx');
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
