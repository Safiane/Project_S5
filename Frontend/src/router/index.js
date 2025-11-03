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
    component: function () {
      return import('../views/ArtistsView.vue')
    }
  },
  {
    path: '/albums',
    name: 'albums',
    component: function () {
      return import('../views/AlbumsView.vue')
    }
  },
  {
    path: '/songs',
    name: 'songs',
    component: function () {
      return import('../views/SongsView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
