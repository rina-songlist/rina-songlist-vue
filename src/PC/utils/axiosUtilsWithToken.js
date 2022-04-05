import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

var vm = new Vue()

switch (process.env.NODE_ENV) {
  case 'production':
    axios.defaults.baseURL = 'http://rina-songlist:8080'
    break
  case 'development':
    axios.defaults.baseURL = 'http://192.168.0.9:8080'
    break
  default:
    axios.defaults.baseURL = 'http://192.168.0.9:8080'
}

/*
 * 设置超时时间
 * 设置是否允许跨域携带身份验证（即cookies）
 */
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
  // token相关
  const token = window.localStorage.getItem('token')
  if (token !== null && token !== '' && token !== undefined) {
    config.headers.Authorization = token
  }

  // 将数组参数序列化
  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}, error => {
  vm.$message.error('无法连接服务器！')
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  const token = response.headers.authorization
  console.log(token)
  if (token !== null && token !== '' && token !== undefined) {
    window.localStorage.setItem('token', token)
  }
  if (response.status !== 200) {
    vm.$message.error('服务器错误，请重试！')
  }
  return response
}, error => {
  vm.$message.error('无法连接服务器！')
  return Promise.reject(error)
})

export default axios
