// vite.config.mjs — build tooling migrated from Create React App (react-scripts) → Vite (THALAB-802).
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    // Replaces the old CRA config-overrides.js browser fallbacks (buffer/stream/timers).
    nodePolyfills({ include: ['buffer', 'stream', 'timers'] }),
  ],
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
    port: 3000,
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
