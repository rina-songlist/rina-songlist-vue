import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/vant-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'

import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
