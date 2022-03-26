<template>
  <div>
    <el-menu
      default-active="2"
      mode="horizontal"
      background-color="#7779c7"
      text-color="#ffffff">
      <!--主要网页信息和链接-->
      <el-menu-item index="1" @click="openLoginMenu">
        <img src="@/assets/pictures/rina.png" class="rina-logo" alt="网页出错了请重新加载_(´ཀ`」 ∠)_"/>
      </el-menu-item>
      <!--TODO 点击跳转至普通用户页-->
      <el-menu-item index="2">林莉奈歌单</el-menu-item>
      <el-menu-item index="3"><a href="https://space.bilibili.com/1243266187" target="_blank">b站主页</a></el-menu-item>
      <el-menu-item index="4"><a href="https://live.bilibili.com/22742508?spm_id_from=333.999.0.0" target="_blank">直播间</a></el-menu-item>
      <!--当前用户信息和状态（登陆后显示）-->
      <el-submenu index="5" v-if="loginState" class="submenu">
        <template slot="title">{{ userName }}</template>
        <!--TODO 这边后面要做退出登陆的实现方法-->
        <el-menu-item index="5-1">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      userName: '1234'
    }
  },
  computed: {
    ...mapState(['loginState'])
  },
  created () {
  },
  methods: {
    ...mapMutations(['setLoginDialogVisible']),
    openLoginMenu() {
      this.setLoginDialogVisible(true)
    }
  }
}
</script>

<style lang="less" scoped>
.rina-logo {
  height: 50px;
  width: 50px;
}

.submenu {
  float: right;
}
</style>
