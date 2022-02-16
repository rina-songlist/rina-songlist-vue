import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登陆状态 true：已登陆，false：未登陆
    loginState: false,
    token: '',
    // 控制是否打开登陆窗口
    loginDialogVisible: false
  },
  mutations: {
    setLoginState(state, newState) {
      state.loginState = newState
    },
    setToken(state, newToken) {
      state.token = newToken
    },
    setLoginDialogVisible(state, newState) {
      state.loginDialogVisible = newState
    }
  },
  actions: {
  },
  modules: {
  }
})
