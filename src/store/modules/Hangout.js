import { Observable } from 'rxjs/Rx';

export default {
  namespaced: true,
  state: {
    initialized: false,
    conversationList: [],
    profileImgMap: {},
    chosenConversationId: 0,

    participants: [],
    history: [],
    pageOffset: 50,
    currentPageNo: 0,
  },
  mutations: {
    initialization(state) { state.initialized = true },
    initConversationList(state, payload) { state.conversationList = payload },
    initProfileImgMap(state, payload) { state.profileImgMap = payload; },
    setProfileImgUrl(state, payload) {
      state.profileImgMap = {
        ...state.profileImgMap,
        [payload.gaiaId]: payload.result
      }
    },
    updateChosenConversationId(state, conversationId) { state.conversationId = conversationId },
    updateChatHistory(state, conversation) { state.history = conversation },
  },
  // actions: {
  //   handleJsonFile: async ({ commit }, file) => {
  //     worker.postMessage({
  //       action: 'HANDLE_JSON_FILE',
  //       file,
  //     })
  //
  //     const res = await handleJsonFile()
  //     if (res) {
  //       console.log(res.data.conversationList)
  //       commit('initConversationList', res.data.conversationList);
  //       // commit('saveConversations', res.data.conversations);
  //       commit('initialization');
  //     }
  //   }
  // }
}
