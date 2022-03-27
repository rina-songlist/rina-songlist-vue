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
      <el-menu-item index="2" @click="jumpToPublic">林莉奈歌单</el-menu-item>
      <el-menu-item index="3"><a href="https://space.bilibili.com/1243266187" target="_blank">b站主页</a></el-menu-item>
      <el-menu-item index="4"><a href="https://live.bilibili.com/22742508?spm_id_from=333.999.0.0" target="_blank">直播间</a></el-menu-item>
      <!--当前用户信息和状态（登陆后显示）-->
      <el-submenu index="5" v-if="loginState" class="submenu">
        <template slot="title">{{ currentUser }}</template>
        <el-menu-item index="5-1" @click="logoutDialogVisible = true">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>

    <!--退出登陆提示框-->
    <el-dialog
      title="提示"
      :visible.sync="logoutDialogVisible"
      width="30%">
      <span>确定要退出登陆吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getSingleMenu } from '@/api/menu'

export default {
  data () {
    return {
      // 退出登陆对话框的显示和隐藏
      logoutDialogVisible: false
    }
  },
  computed: {
    ...mapState(['loginState', 'currentUser'])
  },
  created () {
    if (this.currentUser === '') {
      const currentUser = window.sessionStorage.getItem('user')
      this.setCurrentUser(currentUser)
    }
  },
  methods: {
    ...mapMutations(['setLoginDialogVisible', 'setLoginState', 'setCurrentUser']),
    // 打开登陆菜单
    openLoginMenu() {
      getSingleMenu(1).then(res => {
        if (res.data.code === 200) {
          this.setLoginState(true)
          this.setLoginDialogVisible(false)
          if (this.$route.path !== '/show/song-list') {
            this.$router.push('/show/song-list')
          }
        } else {
          if (this.$route.path !== '/public') {
            this.$router.push('/public')
          }

          this.setLoginState(false)
          this.setLoginDialogVisible(true)
        }
      })
    },
    // 跳转回普通用户页面
    jumpToPublic() {
      if (this.$route.path !== 'public') {
        this.$router.push('/public')
      }
    },
    // 退出登陆
    logout() {
      // 登陆状态的监测数据全部初始化
      this.setLoginState(false)
      this.setCurrentUser('')
      window.localStorage.setItem('token', undefined)

      // 跳转回默认页面
      this.logoutDialogVisible = false
      this.$message.success('退出登陆成功！')
      if (this.$route.path !== 'public') {
        this.$router.push('/public')
      }
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
