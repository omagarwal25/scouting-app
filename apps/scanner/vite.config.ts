import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [vue()],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  optimizeDeps: {
    // link: ['@griffins-scout/game'],
  },
  build: {
    commonjsOptions: {
      include: [/@griffins-scout\/game/, /node_modules/],
    },
  },
});
