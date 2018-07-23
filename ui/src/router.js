import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Subject from './views/Subject.vue';
import CreateSubject from './views/CreateSubject.vue';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/subject/create',
      name: 'subject-create',
      component: CreateSubject,
    },
    {
      path: '/subject/:id',
      name: 'subject-view',
      component: Subject,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
