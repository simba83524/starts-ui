import Vue from 'vue'
import Vuex from 'vuex'
import Token from '@/utils/token'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: {},
    client: {},
    menus:[],
    applications:[],
    routes:[]
  },
  mutations: {
    setAccessToken(state,token){
      Token.setToken(token);
      state.token = token;
    },
    delAccessToken(state){
      state.token = {};
      Token.delToken();
    },
    setClient(state,client){
      Token.setClient(client);
      state.client = client;
    },
    delClient(state){
      state.client = {};
      Token.delClient();
    },
    setMenus(state,data){
      state.menus = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
