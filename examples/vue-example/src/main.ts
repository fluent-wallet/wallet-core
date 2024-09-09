import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { provider } from '@cfx-kit/wallet-core-vue-inject/src';
import wallet from './wallet';

const pinia = createPinia()
const app = createApp(App);
app.use(pinia);

wallet.initPromise.then((database) => {
  provider(app, database);
  app.mount('#app');
});


