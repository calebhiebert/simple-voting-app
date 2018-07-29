import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMq from 'vue-mq';
import VeeValidate from 'vee-validate';
import { createProvider } from './vue-apollo';

import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';

store.dispatch('loadSettings');

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueMq, {
  breakpoints: {
    xs: 480,
    sm: 600,
    md: 840,
    lg: 960,
    xl: 1280,
  },
});

Vue.use(VeeValidate, { events: '' });

const apolloProvider = createProvider({
  wsEndpoint: null,
  connectToDevTools: true,
});

new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  render: (h) => h(App),
}).$mount('#app');
