<template>
  <div>
    <el-card>
      <!--添加权限-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加权限</el-button>
        </el-col>
      </el-row>
      <!--权限表格-->
      <el-table
        :data="roleList"
        border
        stripe
        style="width: 100%"
        v-loading="loading">
        <el-table-column label="权限编号" prop="id"></el-table-column>
        <el-table-column label="权限名" prop="role"></el-table-column>
        <el-table-column label="创建者" prop="createBy"></el-table-column>
        <el-table-column label="更新者" prop="updateBy"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--编辑权限-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除权限-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)"></el-button>
            <!--更改显示菜单-->
            <el-tooltip effect="dark" content="更改显示菜单" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showMenuDialog(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加窗口-->
    <el-dialog
      title="添加权限"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="addDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item label="权限名" prop="role">
          <el-input v-model="editForm.role" @keydown.enter.native="addRole"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑窗口-->
    <el-dialog
      title="修改权限"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="editDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="权限名" prop="role">
          <el-input v-model="editForm.role" @keydown.enter.native="editRole"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!--更改菜单窗口-->
    <el-dialog
      title="更改菜单"
      :visible.sync="menuDialogVisible"
      width="50%"
      :before-close="menuDialogClosed">
      <el-tree
        :data="menuList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="roleMenu.menuIds"
        :props="treeProps"
        ref="tree">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialogClosed">取 消</el-button>
        <el-button type="primary" @click="changeMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { changeMenus, deleteRole, editRole, getSingleRole, listRole, listRoleMenus } from '@/api/role'
import { listMenu } from '@/api/menu'

export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      menuList: [],
      // 加载状态
      loading: false,
      // 是否显示添加窗口
      addDialogVisible: false,
      // 添加（编辑）的校验规则
      rules: {
        role: [{ required: true, message: '请输入权限名！', trigger: 'blur' }]
      },
      // 是否显示编辑窗口
      editDialogVisible: false,
      // 编辑表单
      editForm: {
        id: 0,
        role: ''
      },
      // 所选权限的可查看菜单
      roleMenu: {
        roleId: 0,
        menuIds: []
      },
      // 是否显示更改菜单窗口
      menuDialogVisible: false,
      // 树形结构参数
      treeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.getRoles()
  },
  watch: {
    addDialogVisible(newState, oldState) {
      if (newState === true) {
        this.editForm.id = 0
        this.editForm.role = ''
      }
    }
  },
  methods: {
    getRoles() {
      this.loading = true

      listRole().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('权限列表获取失败！')
        }

        this.loading = false
        this.$message.success('权限列表获取成功！')
        this.roleList = res.data.data
      })
    },
    // 关闭添加窗口的方法
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    // 添加权限的方法
    addRole() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }

        editRole(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('权限添加失败！')
          }

          this.$message.success('权限添加成功！')
          this.addDialogClosed()
          this.getRoles()
        })
      })
    },
    // 显示编辑窗口的方法
    showEditDialog(roleId) {
      getSingleRole(roleId).then(res => {
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
    // 编辑权限的方法
    editRole() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }

        editRole(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('编辑权限失败！')
          }

          this.$message.success('编辑权限成功！')
          this.editDialogClosed()
          this.getRoles()
        })
      })
    },
    // 显示更改菜单窗口的方法
    showMenuDialog(roleId) {
      listRoleMenus(roleId).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('服务器错误，无法更改！')
        }

        listMenu({ type: 'tree' }).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error('服务器错误，无法更改！')
          }
          this.menuList = res.data.data
        })
        if (this.menuList === []) {
          return
        }

        this.roleMenu.roleId = roleId
        this.roleMenu.menuIds = res.data.data
        this.menuDialogVisible = true
      })
    },
    // 关闭更改菜单窗口的方法
    menuDialogClosed() {
      this.roleMenu.roleId = 0
      this.roleMenu.menuIds = []
      this.menuDialogVisible = false
    },
    // 更改菜单窗口
    changeMenu() {
      const newMenuIds = this.$refs.tree.getCheckedKeys()

      changeMenus(this.roleMenu.roleId, newMenuIds).then(res => {
        if (res.data.code !== 201) {
          return this.$message.error('更改菜单失败！')
        }

        this.$message.success('更改菜单成功！')
        this.menuDialogClosed()
      })
    },
    // 删除权限
    async deleteRole(roleId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      deleteRole(roleId).then(res => {
        if (res.data.code !== 204) {
          return this.$message.error('删除权限失败！')
        }

        this.$message.success('删除权限成功！')
        this.getRoles()
      })
    }
  }
}
</script>

<style scoped>

</style>
