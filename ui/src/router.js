import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Subject from './views/Subject.vue';
import CreateSubject from './views/CreateSubject.vue';
import Login from './views/Login.vue';
import Users from './views/Users.vue';
import axios from 'axios';

Vue.use(Router);

const authGuard = (to, from, next) => {
  if (localStorage.getItem('access-token') !== null) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access-token')}`;
    next();
  } else {
    next({ name: 'login' });
  }
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: authGuard,
    },
    {
      path: '/subject/create',
      name: 'subject-create',
      component: CreateSubject,
      beforeEnter: authGuard,
    },
    {
      path: '/subject/:id',
      name: 'subject-view',
      component: Subject,
      beforeEnter: authGuard,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      beforeEnter: authGuard,
    },
  ],
});
