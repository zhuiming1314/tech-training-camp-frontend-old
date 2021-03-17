import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: '',
    file: ''
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      sessionStorage.token = token
    },
    setFile (state, file) {
      state.file = file
      sessionStorage.file = file
    }
  },
  getters: {
    getToken (state) {
      if (!state.token) {
        state.token = sessionStorage.getItem('token')
      }
      return state.token
    },
    getFile (state) {
      if (!state.file) {
        state.file = sessionStorage.getItem('file')
      }
      return state.file
    }
  }
})

export default store
