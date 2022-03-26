import axios from 'axios'

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

export default axios
