import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMq from 'vue-mq';
import api from './api';
import VeeValidate from 'vee-validate';

import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';

api.getMe().then((me) => {
  store.commit('setMe', me);
});

store.dispatch('loadSettings');

Vue.config.productionTip = false;

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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
