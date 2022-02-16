import Vue from 'vue'
import VueRouter from 'vue-router'

import PublicSongList from '@/views/PublicSongList'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/public'
  },
  {
    path: '/public',
    component: PublicSongList
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/public') {
    return next()
  }

  if (this.$store.state.token === '') {
    return next('/public')
  }
  next()
})

export default router
