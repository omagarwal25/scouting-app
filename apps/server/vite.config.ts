import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import replace from '@rollup/plugin-replace';
import path from 'path';

const pwaOptions: Partial<VitePWAOptions> = {
  base: '/',
  includeAssets: ['favicon.svg'],
  filename: 'service-worker.js',
  manifest: {
    name: 'Scouting Server',
    short_name: 'Scouting',
    theme_color: '#93211a',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
};

const replaceOptions = { __DATE__: new Date().toISOString() };
const claims = process.env.CLAIMS === 'true';
const reload = process.env.RELOAD_SW === 'true';

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src';
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts';
  pwaOptions.strategies = 'injectManifest';
  (pwaOptions.manifest as Partial<ManifestOptions>).name =
    'PWA Inject Manifest';
  (pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject';
}

if (claims) pwaOptions.registerType = 'autoUpdate';

if (reload) {
  // @ts-ignore
  replaceOptions.__RELOAD_SW__ = 'true';
}

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [vue(), VitePWA(pwaOptions), replace(replaceOptions)],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
