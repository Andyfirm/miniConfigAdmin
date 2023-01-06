const user = {
  state: {
    token: sessionStorage.getItem('token'),
    roles: [],
    userInfo: '',
    isCollapse: false
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ISCOLLAPSE: (state) => {
      console.log(state)
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {
  }
}

export default user