import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMq from 'vue-mq';
import api from './api';
import axios from 'axios';
import VeeValidate from 'vee-validate';

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

if (localStorage.getItem('access-token') !== null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access-token')}`;
}

api.getMe().then((me) => {
  store.commit('setMe', me);
});
