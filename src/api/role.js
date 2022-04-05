import axios from '@/PC/utils/axiosUtilsWithToken'

// 获取权限列表
export const listRole = () => { return axios.get('/private/system/role') }

// 获取当前权限下的菜单
export const listRoleMenus = (reqParams) => { return axios.get('/private/system/roleMenu/' + reqParams) }

// 获取单条权限
export const getSingleRole = (reqParams) => { return axios.get('/private/system/role/' + reqParams) }

// 添加（更改）一条权限
export const editRole = (reqParams) => { return axios.put('/private/system/role', reqParams) }

// 更改可查看菜单
export const changeMenus = (roleId, menuIds) => { return axios.post('/private/system/role/' + roleId, menuIds) }

// 删除一条权限
export const deleteRole = (reqParams) => { return axios.delete('/private/system/role/' + reqParams) }
