// vite.config.mjs — build tooling migrated from Create React App (react-scripts) → Vite (THALAB-802).
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The CRA codebase puts JSX in .js files; tell esbuild to parse them as JSX.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  // Keep the existing REACT_APP_* env convention (now exposed via import.meta.env).
  envPrefix: 'REACT_APP_',
  server: {
    // 3210 is the standing local review port for this site; 3000 is taken by the Plex_App backend.
    port: 3210,
    strictPort: true,
    // Mirror CRA's "proxy": forward API calls to the Express backend.
    proxy: { '/api': 'http://localhost:5000' },
  },
  build: {
    outDir: 'build', // match the nginx static root + existing deploy scripts
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
