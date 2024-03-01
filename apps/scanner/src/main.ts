import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

// @ts-ignore
import { createPinia } from 'pinia';
import { VueQrcodeReader } from 'vue-qrcode-reader';

const app = createApp(App);

app.use(VueQrcodeReader);
app.use(createPinia());
app.mount('#app');
