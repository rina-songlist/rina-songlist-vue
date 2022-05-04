<template>
  <div>
    <el-card>
      <!--搜索与添加-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="搜索歌曲名或歌手" v-model="queryInfo.nameOrArtist" @keydown.enter.native="getSongList">
            <el-button slot="append" icon="el-icon-search" @click="getSongList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加歌曲</el-button>
        </el-col>
      </el-row>
      <!--表格信息-->
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
        <el-table-column label="创建者" prop="createBy"></el-table-column>
        <el-table-column label="更新者" prop="updateBy"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSong(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>

    <!--添加窗口-->
    <el-dialog
      title="添加歌曲"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="addDialogClosed">
      <el-form ref="addFormRef" :rules="songRules" :model="editForm" label-width="70px">
        <el-form-item label="歌名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="歌手" prop="artist">
          <el-input v-model="editForm.artist"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-input v-model="editForm.language" @keydown.enter.native="addSong"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addSong">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑窗口-->
    <el-dialog
      title="编辑歌曲"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="editDialogClosed">
      <el-form ref="editFormRef" :rules="songRules" :model="editForm" label-width="70px">
        <el-form-item label="歌名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="歌手" prop="artist">
          <el-input v-model="editForm.artist"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-input v-model="editForm.language" @keydown.enter.native="editSong"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editSong">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteSongList, editSongList, getSingleList, listSongList } from '@/api/songList'

export default {
  name: 'SonList',
  data() {
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
      // 是否显示添加对话框
      addDialogVisible: false,
      // 添加参数
      addForm: {
        name: '',
        artist: '',
        language: ''
      },
      // 校验规则
      songRules: {
        name: [{ required: true, message: '请输入歌曲名！', trigger: 'blur' }],
        artist: [{ required: true, message: '请输入歌曲名！', trigger: 'blur' }],
        language: [{ required: true, message: '请输入歌曲名！', trigger: 'blur' }]
      },
      // 编辑参数
      editForm: {
        id: 0,
        name: '',
        artist: '',
        language: ''
      },
      // 是否显示编辑对话框
      editDialogVisible: false
    }
  },
  created () {
    this.getSongList()
  },
  methods: {
    // 获取歌单列表
    getSongList () {
      this.loading = true

      this.queryInfo.nameOrArtist = this.queryInfo.nameOrArtist.trim()

      listSongList(this.queryInfo).then(res => {
        console.log(res.data)

        if (res.data.code !== 200) {
          return this.$message.error('歌单获取失败！')
        } else {
          this.loading = false
          this.$message.success('歌单获取成功！')
          this.songList = res.data.data
          this.total = res.data.total

          if (this.totalSongNum === 0) {
            this.totalSongNum = res.data.total
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
    // 关闭添加窗口的方法
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    // 添加歌曲的方法
    addSong() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }

        editSongList(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('添加歌曲失败！')
          }

          this.$message.success('添加歌曲成功！')
          this.addDialogClosed()
          this.getSongList()
        })
      })
    },
    // 显示编辑窗口的方法
    showEditDialog(songId) {
      getSingleList(songId).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('服务器错误，无法编辑！')
        }

        this.editForm = res.data.data
        this.editDialogVisible = true
      })
    },
    // 关闭编辑窗口的方法
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 编辑歌曲的方法
    editSong() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }

        editSongList(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('添加歌曲失败！')
          }

          this.$message.success('添加歌曲成功！')
          this.editDialogClosed()
          this.getSongList()
        })
      })
    },
    // 删除歌曲的方法
    async deleteSong(songId) {
      const confirmResult = await this.$confirm('此操作将永久删除该歌曲，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      deleteSongList(songId).then(res => {
        if (res.data.code !== 204) {
          return this.$message.error('删除歌曲失败！')
        }

        this.$message.success('删除歌曲成功！')
        this.getSongList()
      })
    }
  }
}
</script>

<style scoped>

</style>
