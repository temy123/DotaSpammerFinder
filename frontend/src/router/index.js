import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ServiceView from '../views/ServiceView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/service',
    name: 'Service',
    component: ServiceView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;