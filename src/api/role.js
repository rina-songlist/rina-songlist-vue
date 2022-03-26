import axios from '@/utils/axiosUtilsWithToken'

// 获取权限列表
export const listRole = () => { return axios.get('/private/system/role') }

// 获取单条权限
export const getSingleRole = (reqParams) => { return axios.get('/private/system/role/' + reqParams) }

// 添加（更改）一条权限
export const editRole = (reqParams) => { return axios.put('/private/system/role', reqParams) }

// 删除一条权限
export const deleteRole = (reqParams) => { return axios.delete('/private/system/role/' + reqParams) }
