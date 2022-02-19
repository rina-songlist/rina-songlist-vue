<template>
  <div>
    <el-card>
      <!--搜索与随机-->
      <el-row :gutter="20">
        <el-col :span="6" :offset="6">
          <el-input placeholder="搜索歌曲名或歌手" v-model="queryInfo.nameOrArtist" @keydown.enter.native="getSongList">
            <el-button slot="append" icon="el-icon-search" @click="getSongList"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" icon="el-icon-more" @click="randomOneSong">随机选一首歌</el-button>
        <el-button type="primary" icon="el-icon-more-outline" @click="randomFiveSongs">随机选五首歌</el-button>
      </el-row>

      <!--表格信息-->
      <el-row
        type="flex"
        justify="center">
        <el-col :span="12">
          <el-table
            :data="songList"
            border
            stripe
            style="width: 100%"
            @sort-change="sortTable"
            v-loading="loading">
            <el-table-column label="歌曲编号" prop="id" sortable="custom"></el-table-column>
            <el-table-column label="歌名" prop="name" sortable="custom"></el-table-column>
            <el-table-column label="歌手" prop="artist" sortable="custom"></el-table-column>
            <el-table-column label="语言" prop="language" sortable="custom"></el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row
        type="flex"
        justify="center">
        <el-col :offset="6">
          <!--分页控件-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[10, 15, 20]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!--登陆对话框-->
    <el-dialog
      title="账号登陆"
      :visible.sync="loginDialogVisible"
      width="50%"
      @close="loginDialogClosed">
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="loginDialogClosed">取 消</el-button>
        <el-button type="primary" @click="login">登 陆</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { publicSongList } from '@/api/songList'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      songList: [],
      // 加载状态
      loading: false,
      // 查询参数
      queryInfo: {
        pageSize: 10,
        pageNum: 1,
        nameOrArtist: '',
        ids: [],
        orderBy: 'id',
        withDesc: false
      },
      // 当前查询结果的总数据条数
      total: 0,
      // 数据库中的总曲目数
      totalSongNum: 0,
      // 登陆表单
      loginForm: {
        username: '',
        password: ''
      },
      // 登陆表单验证
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 控制登陆窗口打开状态
    loginDialogVisible: {
      get() {
        return this.$store.state.loginDialogVisible
      },
      set(msg) {
        console.log(msg)
      }
    }
  },
  created () {
    this.getSongList()
  },
  methods: {
    ...mapMutations(['setLoginDialogVisible']),
    // 获取歌单列表
    getSongList () {
      this.loading = true

      this.queryInfo.nameOrArtist = this.queryInfo.nameOrArtist.trim()

      publicSongList(this.queryInfo).then(res => {
        console.log(res)

        this.loading = false
        if (res.code !== 200) {
          this.$message.error('歌单获取失败！')
        } else {
          this.$message.success('歌单获取成功！')
          this.songList = res.data
          this.total = res.total

          if (this.totalSongNum === 0) {
            this.totalSongNum = res.total
          }
        }
      })
    },
    // 更改页面大小的方法
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getSongList()
    },
    // 更改当前页码的方法
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getSongList()
    },
    // 歌曲排序
    sortTable (column) {
      this.queryInfo.orderBy = column.prop
      if (column.order === 'ascending' || column.order === null) {
        this.queryInfo.withDesc = false
      } else if (column.order === 'descending') {
        this.queryInfo.withDesc = true
      }
      this.getSongList()
    },
    // 随机一首歌
    randomOneSong() {
      this.queryInfo.ids[0] = Math.ceil(Math.random() * this.totalSongNum)
      this.getSongList()
    },
    // 随机选五首歌
    randomFiveSongs() {
      for (let i = 0; i < 5; i++) {
        this.queryInfo.ids[i] = Math.ceil(Math.random() * this.totalSongNum)
      }
      this.getSongList()
    },
    // 关闭对话框的函数
    loginDialogClosed() {
      this.$refs.loginFormRef.resetFields()
      this.setLoginDialogVisible(false)
    },
    // 登陆按钮的函数
    login() {
      this.$refs.loginFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return
        }

        // TODO 登陆事件
        this.setLoginDialogVisible(false)
      })
    }
  }
}
</script>

<style scoped>

</style>
