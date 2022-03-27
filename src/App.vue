<template>
  <div>
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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import leftnav from '@/components/leftnav'
import navcon from '@/components/navcon'

export default {
  name: 'app',
  components: {
    leftnav,
    navcon
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['loginState'])
  },
  created () {
  },
  methods: {
    ...mapMutations(['setLoginState'])
  },
  beforeMount () {
    // 在进入普通用户界面前将登陆状态改为未登陆
    if (this.$route.path === '/public') {
      this.setLoginState(false)
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
}
.el-aside {
  .el-menu {
    border-right: none;
    height: 100%;
  }
}
.el-header {
  padding: 0;
}
</style>
