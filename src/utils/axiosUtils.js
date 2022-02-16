import axios from 'axios'
import store from '@/store'
import qs from 'qs'

switch (process.env.NODE_ENV) {
  case 'production':
    axios.defaults.baseURL = 'http://172.17.0.7:8888'
    break
  case 'test':
    axios.defaults.baseURL = 'http://172.17.0.7:8080'
    break
  default:
    axios.defaults.baseURL = 'http://192.168.0.9:8080'
}

/*
 * 设置超时时间
 * 设置是否允许跨域携带身份验证（即cookies）
 */
axios.defaults.timeout = 10000
// axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
  // token相关
  const token = store.state.token
  if (token !== '') {
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
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  const token = response.headers.Authorization
  if (token !== null && token !== '' && token !== 'undefined') {
    store.commit('setToken', token)
  }
  return response.data
}, error => {
  return Promise.reject(error)
})

export default axios
