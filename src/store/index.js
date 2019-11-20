import Vue from 'vue'
import Vuex from 'vuex'
import {getUserList} from "../api";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
      userList:[],
      curUser:''
    },
    mutations: {
      userListChange(state,newValue){
          state.userList=newValue;
      },
      curUserChange(state,newValue){
          state.curUser=newValue;
      },
    },
    getter: {

    },
  actions:{
      getUserList(context){
        getUserList().then(res=>{
          context.commit('userListChange',res.data)
        })
      }
  }
})



