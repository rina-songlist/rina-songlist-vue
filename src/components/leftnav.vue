<template>
  <el-menu
    background-color="#7779c7"
    text-color="#ffffff"
    active-text-color="#FFCC01"
    :default-active="currentPath"
    unique-opened
    menu-trigger="click"
    router>
    <!--一级菜单-->
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="subItem in item.children" :index="subItem.url + ''" :key="subItem.id">
          <template slot="title">
            <i :class="subItem.icon"></i>
            <span>{{subItem.name}}</span>
          </template>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { listMenu } from '@/api/menu'

export default {
  data () {
    return {
      // 所有菜单
      menuList: [],
      currentPath: ''
    }
  },
  created () {
    this.getTreeMenu()
    this.currentPath = this.$route.path
  },
  methods: {
    getTreeMenu() {
      listMenu({ type: 'tree' }).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('菜单列表获取失败！')
        }

        this.menuList = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
  height: 100%;
}
</style>
