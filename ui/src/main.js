import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMq from 'vue-mq';

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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
