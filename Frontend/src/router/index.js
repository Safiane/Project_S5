import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/artists',
    name: 'artists',
    component: () => import('../views/ArtistsView.vue')
  },
  {
    path: '/albums',
    name: 'albums',
    component: () => import('../views/AlbumsView.vue')
  },
  {
    path: '/songs',
    name: 'songs',
    component: () => import('../views/SongsView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')   // <-- nouvelle vue
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
