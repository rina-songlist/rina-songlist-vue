<template>
  <el-container class="main-container">
    <el-aside width="200px" v-if="loginState">
      <leftnav></leftnav>
    </el-aside>
    <el-container>
      <el-header>
        <navcon></navcon>
      </el-header>
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import leftnav from '@/PC/components/leftnav'
import navcon from '@/PC/components/navcon'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'PC',
  components: {
    leftnav,
    navcon
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['loginState'])
  },
  created () {
    const state = window.sessionStorage.getItem('state')
    if (!this.loginState && state !== 'null') {
      if (state === 'false') {
        this.setLoginState(false)
      }
      if (state === 'true') {
        this.setLoginState(true)
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginState'])
  },
  beforeMount () {
    // 在进入普通用户界面前将登陆状态改为未登陆
    if (this.$route.path === '/pc/public') {
      this.setLoginState(false)
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
}

.el-header {
  padding: 0;
}
</style>
