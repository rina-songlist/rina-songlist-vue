import axios from '@/PC/utils/axiosUtilsWithToken'

// 查看菜单列表
export const listMenu = (reqParams) => { return axios.get('/private/system/menu', { params: reqParams }) }

// 获取单一菜单
export const getSingleMenu = (reqParams) => { return axios.get('/private/system/menu/' + reqParams) }

// 添加（更改）一条菜单
export const editMenu = (reqParams) => { return axios.put('/private/system/menu', reqParams) }

// 删除一条菜单
export const deleteMenu = (reqParams) => { return axios.delete('/private/system/menu/' + reqParams) }
