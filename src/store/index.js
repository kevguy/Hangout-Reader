import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import UI from './modules/UI'
import MixPanel from './modules/MixPanel'

import Hangout from './modules/Hangout'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    modules: {
      UI,
      MixPanel,
      Hangout,
    },
    state: {
      environment: '',
      activeType: null,
      itemsPerPage: 20,
      items: {/* [id: number]: Item */},
      users: {/* [id: string]: User */},
      lists: {
        top: [/* number */],
        new: [],
        show: [],
        ask: [],
        job: []
      }
    },
    actions,
    mutations,
    getters
  })
}
