import axios from '@/utils/axiosUtilsWithToken'

// 用户登陆
export const login = (reqParams) => { return axios.post('/private/login', reqParams) }

// 更新token
export const tokenUpdate = (reqParams) => { return axios.get('/private/system/user/update', { params: reqParams }) }

// 获取所有用户
export const listUsers = () => { return axios.get('/private/system/user') }

// 获取单个用户
export const getSingleUser = (reqParams) => { return axios.get('/private/system/user/' + reqParams) }

// 添加（更改）用户
export const editUser = (reqParams) => { return axios.put('/private/system/user', reqParams) }

// 删除一个用户
export const deleteUser = (reqParams) => { return axios.delete('/private/system/user/' + reqParams) }
