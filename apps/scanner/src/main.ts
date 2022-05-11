/// <reference types="vite-plugin-pwa/client" />
import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

// @ts-ignore
import QrReader from 'vue3-qr-reader';
import { createPinia } from 'pinia';

import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const app = createApp(App);
app.use(QrReader);
app.use(createPinia());
app.mount('#app');
