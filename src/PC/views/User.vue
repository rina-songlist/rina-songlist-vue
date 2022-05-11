<template>
  <div>
    <el-card>
      <!--添加用户-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户表格-->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%"
        v-loading="loading">
        <el-table-column label="用户编号" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="用户状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="权限" prop="roleName"></el-table-column>
        <el-table-column label="创建者" prop="createBy"></el-table-column>
        <el-table-column label="更新者" prop="updateBy"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--编辑用户-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除用户-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!--更改权限-->
            <el-tooltip effect="dark" content="更改权限" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加窗口-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="addDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" autocomplete="off" v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" autocomplete="off" v-model="editForm.confirmPassword" @keydown.enter.native="addUser"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="editForm.status"
                     active-color="#13ce66"
                     inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑窗口-->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="editDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" autocomplete="off" v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" autocomplete="off" v-model="editForm.confirmPassword" @keydown.enter.native="editUser"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--赋权窗口-->
    <el-dialog
      title="更改用户权限"
      :visible.sync="roleDialogVisible"
      width="50%"
      :before-close="roleDialogClosed">
      <el-form>
        <el-form-item label="权限：">
          <el-select v-model="currentUserDetails.roleId" placeholder="请选择权限">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogClosed">取 消</el-button>
        <el-button type="primary" @click="changeRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { changeRole, deleteUser, editUser, getSingleUser, listUsers, tokenUpdate } from '@/api/user'
import { mapState } from 'vuex'
import { listRole } from '@/api/role'

export default {
  name: 'User',
  data() {
    // 验证编辑确认密码的规则
    var checkEditConfirmPassword = (rule, value, callback) => {
      if (value === this.editForm.password) {
        return callback()
      }
      callback(new Error('两次密码不一致！'))
    }

    return {
      userList: [],
      roleList: [],
      // 加载状态
      loading: false,
      // 是否显示添加对话框
      addDialogVisible: false,
      // 是否显示编辑对话框
      editDialogVisible: false,
      // 编辑参数
      editForm: {
        id: 0,
        userName: '',
        password: '',
        confirmPassword: '',
        status: false
      },
      // 编辑的校验规则
      rules: {
        userName: [
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          { max: 20, message: '长度不得超过 20 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码！', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { validator: checkEditConfirmPassword, trigger: 'blur' }
        ]
      },
      // 即将更改的用户名
      changingUser: '',
      // 编辑中的用户信息
      currentUserDetails: {
        userId: 0,
        roleId: 0
      },
      // 是否显示更改权限菜单
      roleDialogVisible: false
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created () {
    this.getUsers()
  },
  watch: {
    addDialogVisible(newState, oldState) {
      if (newState === true) {
        this.editForm.id = 0
        this.editForm.userName = ''
        this.editForm.password = ''
        this.editForm.status = false
      }
    }
  },
  methods: {
    getUsers() {
      this.loading = true

      listUsers().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('获取用户列表失败！')
        }

        this.loading = false
        this.$message.success('获取用户列表成功！')
        this.userList = res.data.data
      })
    },
    // 改变用户状态
    userStateChanged(userDetail) {
      editUser(userDetail).then(res => {
        if (res.data.code !== 201) {
          userDetail.status = !userDetail.status
          return this.$message.error('状态更改失败！')
        }

        this.getUsers()
      })
    },
    // 关闭添加窗口
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }

        editUser(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('用户添加失败！')
          }

          this.$message.success('用户添加成功！')
          this.addDialogClosed()
          this.getUsers()
        })
      })
    },
    // 显示编辑窗口的方法
    showEditDialog(userId) {
      getSingleUser(userId).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('服务器错误，无法编辑！')
        }

        this.editForm = res.data.data
        this.changingUser = res.data.data.userName
        this.editDialogVisible = true
      })
    },
    // 关闭编辑窗口的方法
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 编辑用户
    editUser() {
      this.$refs.editFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return
        }

        editUser(this.editForm).then(res => {
          if (res.data.code !== 201) {
            return this.$message.error('编辑用户失败！')
          }

          this.$message.success('编辑用户成功！')
          if (this.changingUser === this.currentUser) {
            tokenUpdate({ username: this.editForm.userName }).then(res => res)
          }
          this.changingUser = ''
          this.editDialogClosed()
          this.getUsers()
        })
      })
    },
    // 显示更改权限窗口的方法
    showRoleDialog(currentUser) {
      listRole().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error('服务器错误，暂时无法更改权限！')
        }

        this.roleList = res.data.data
        this.currentUserDetails.userId = currentUser.id
        this.currentUserDetails.roleId = currentUser.roleId
        this.roleDialogVisible = true
      })
    },
    // 关闭更改用户权限窗口的方法
    roleDialogClosed() {
      this.roleDialogVisible = false
      this.currentUserDetails.userId = 0
      this.currentUserDetails.roleId = 0
    },
    // 更改用户权限
    changeRole() {
      changeRole(this.currentUserDetails).then(res => {
        if (res.data.code !== 201) {
          return this.$message.error('权限更改错误！')
        }

        this.$message.success('权限更改成功！')
        this.roleDialogClosed()
        this.getUsers()
      })
    },
    // 删除用户的方法
    async deleteUser(userId) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      deleteUser(userId).then(res => {
        if (res.data.code !== 204) {
          return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功！')
        this.getUsers()
      })
    }
  }
}
</script>

<style scoped>

</style>
