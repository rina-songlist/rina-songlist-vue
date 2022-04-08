import Vue from 'vue'
import VueRouter from 'vue-router'

// import PublicSongList from '@/PC/views/PublicSongList'
const PublicSongList = () => import(/* webpackChunkName: "public" */ '@/PC/views/PublicSongList')
// import Mobile from '@/Mobile/Mobile'
const Mobile = () => import(/* webpackChunkName: "public" */ '@/Mobile/Mobile')
// import PC from '@/PC/PC'
const PC = () => import(/* webpackChunkName: "public" */ '@/PC/PC')

// import Menu from '@/PC/views/Menu'
const Menu = () => import(/* webpackChunkName: "private" */ '@/PC/views/Menu')
// import Role from '@/PC/views/Role'
const Role = () => import(/* webpackChunkName: "private" */ '@/PC/views/Role')
// import SonList from '@/PC/views/SonList'
const SonList = () => import(/* webpackChunkName: "private" */ '@/PC/views/SonList')
// import User from '@/PC/views/User'
const User = () => import(/* webpackChunkName: "private" */ '@/PC/views/User')

Vue.use(VueRouter)

// 根据设备选择重定向方向
const redirectPath = /Android | webos | iphone | iPod | BlackBerry | liPad | QQ | MicroMessenger/i.test(navigator.userAgent) ? '/mobile' : '/pc'
console.log(redirectPath)
const routes = [
  {
    path: '/',
    redirect: redirectPath
  },
  {
    path: '/mobile',
    component: Mobile
  },
  {
    path: '/pc',
    redirect: '/pc/public',
    component: PC,
    children: [
      {
        path: 'public',
        component: PublicSongList
      },
      {
        path: 'system/users',
        component: User
      },
      {
        path: 'system/role',
        component: Role
      },
      {
        path: 'system/menu',
        component: Menu
      },
      {
        path: 'show/song-list',
        component: SonList
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (redirectPath === '/mobile' && to.path.search('mobile') === -1) {
    next({ path: '/mobile' })
  } else {
    next()
  }

  if (redirectPath === '/pc' && to.path.search('pc') === -1) {
    next({ path: '/pc' })
  } else {
    next()
  }

  const token = window.localStorage.getItem('token')
  if (redirectPath === '/pc' &&
    to.path !== '/pc/public' &&
    (token === null || token === '' || token === undefined)) {
    next({ path: '/pc' })
  } else {
    next()
  }
})

export default router
