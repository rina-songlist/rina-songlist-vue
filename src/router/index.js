import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from '@/views/Menu'
import PublicSongList from '@/views/PublicSongList'
import Role from '@/views/Role'
import SonList from '@/views/SonList'
import User from '@/views/User'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/public'
  },
  {
    path: '/public',
    component: PublicSongList
  },
  {
    path: '/system/users',
    component: User
  },
  {
    path: '/system/role',
    component: Role
  },
  {
    path: '/system/menu',
    component: Menu
  },
  {
    path: '/show/song-list',
    component: SonList
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/public') {
    return next()
  }

  const token = window.localStorage.getItem('token')
  if (token === null || token === '' || token === 'undefined') {
    return next('/public')
  }
  next()
})

export default router
