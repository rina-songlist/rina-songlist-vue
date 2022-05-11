<template>
  <div>
    <el-card>
      <!--添加菜单-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加菜单</el-button>
        </el-col>
      </el-row>
      <!--菜单表格-->
      <el-table
        :data="menuList"
        border
        stripe
        style="width: 100%"
        v-loading="loading">
        <el-table-column label="菜单编号" prop="id"></el-table-column>
        <el-table-column label="菜单名" prop="name"></el-table-column>
        <el-table-column label="父级菜单" prop="parentName"></el-table-column>
        <el-table-column label="当前层级排序" prop="orderValue"></el-table-column>
        <el-table-column label="创建者" prop="createBy"></el-table-column>
        <el-table-column label="更新者" prop="updateBy"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--编辑菜单-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除菜单-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMenu(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加菜单-->
    <el-dialog
      title="添加菜单"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="addDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-select v-model="editForm.parentId" clearable placeholder="请选择父级菜单">
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前层级排序" prop="orderValue">
          <el-input v-model.number="editForm.orderValue" @keydown.enter.native="addMenu"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑菜单-->
    <el-dialog
      title="编辑菜单"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="editDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-select v-model="editForm.parentId" clearable placeholder="请选择父级菜单">
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前层级排序" prop="orderValue">
          <el-input v-model.number="editForm.orderValue" @keydown.enter.native="editMenu"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteMenu, editMenu, getSingleMenu, listMenu } from '@/api/menu'

export default {
  name: 'Menu',
  data() {
    return {
      menuList: [],
      // 加载状态
      loading: false,
      // 校验规则
      rules: {
        name: [{ required: true, message: '请输入菜单名！', trigger: 'blur' }],
        orderValue: [
          { required: true, message: '请输入当前层级排序！', trigger: 'blur' },
          { type: 'number', message: '排序值必须为数字值！', trigger: 'blur' }
        ]
      },
      // 是否显示添加菜单
      addDialogVisible: false,
      // 编辑表单
      editForm: {
        id: 0,
        name: '',
        icon: '',
        url: '',
        parentId: '',
        orderValue: 0
      },
      // 是否显示编辑窗口
      editDialogVisible: false
    }
  },
  created () {
    this.getMenus()
  },
  watch: {
    addDialogVisible(newState, oldState) {
      if (newState === true) {
        this.editForm.id = ''
        this.editForm.name = ''
        this.editForm.icon = ''
        this.editForm.url = ''
        this.editForm.parentId = ''
        this.editForm.orderValue = 0
      }
    }
  },
  methods: {
    getMenus() {
      this.loading = true
      listMenu({ type: 'list' }).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('获取菜单列表失败！')
        }

        this.loading = false
        this.menuList = res.data.data
      })
    },
    // 关闭添加菜单的方法
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.editForm.parentId = ''
      this.addDialogVisible = false
    },
    // 添加菜单的方法
    addMenu() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }

        if (this.editForm.parentId === '') {
          this.editForm.parentId = 0
        }
        editMenu(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('菜单添加失败！')
          }

          this.$message.success('菜单添加成功！')
          this.addDialogClosed()
          this.getMenus()
        })
      })
    },
    // 显示编辑窗口的方法
    showEditDialog(menuId) {
      getSingleMenu(menuId).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('服务器错误，暂时无法编辑！')
        }

        this.editForm = res.data.data
        this.editDialogVisible = true
      })
    },
    // 关闭编辑窗口的方法
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm.parentId = ''
      this.editDialogVisible = false
    },
    // 编辑菜单的方法
    editMenu() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }

        if (this.editForm.parentId === '') {
          this.editForm.parentId = 0
        }
        editMenu(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('菜单编辑失败！')
          }

          this.$message.success('菜单编辑成功！')
          this.editDialogClosed()
          this.getMenus()
        })
      })
    },
    // 删除菜单的方法
    async deleteMenu(menuId) {
      const confirmResult = await this.$confirm('此操作将永久删除该菜单，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      deleteMenu(menuId).then(res => {
        if (res.data.code !== 204) {
          return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功！')
        this.getMenus()
      })
    }
  }
}
</script>

<style scoped>

</style>
