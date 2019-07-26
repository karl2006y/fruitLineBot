import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import './sdk'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lineId: false
  },
  actions: {
    getLineId(context, lineId) {
      context.commit('SETLINEID', lineId)
    }
  },
  mutations: {
    SETLINEID(state, lineId) {
      state.lineId = lineId
    }
  }
})
