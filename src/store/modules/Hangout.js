export default {
  namespaced: true,
  state: {
    initialized: false,
    participantList: [],
    conversationList: [],
    conversationContents: [],

    profileImgMap: {},

    chosenConversationId: 0,

    participants: [],
    chosenConversationContent: [],

    pageOffset: 50,
    currentPageNo: 1,
  },
  mutations: {
    initialization(state) { state.initialized = true },
    initConversationList(state, payload) { state.conversationList = payload },
    initParticipantList(state, payload) { state.participantList = payload },
    initConversationContents(state, payload) { state.conversationContents = payload },
    initProfileImgMap(state, payload) { state.profileImgMap = payload; },
    setProfileImgUrl(state, payload) {
      state.profileImgMap = {
        ...state.profileImgMap,
        [payload.gaiaId]: payload.result
      }
    },
    updateChosenConversation(state, conversationId) {
      state.chosenConversationId = conversationId
      state.chosenConversationContent = state.conversationContents[conversationId]
    },
    updateCurrentPageNo(state, num) { state.currentPageNo = num },
    incrementCurrentPageNo(state) { state.currentPageNo++ },
    decrementCurrentPageNo(state) { state.currentPageNo-- }
  },
  getters: {
    numOfMsgs: state => state.chosenConversationContent.length,
    numOfPages: (state, getters) => {
      const num = Math.floor(getters.numOfMsgs / state.pageOffset);
      if (((getters.numOfMsgs) % (state.pageOffset)) > 0) {
        return num + 1
      }
      return num
    },
    msgToShow: (state) => {
      const startIdx = (state.currentPageNo - 1) * state.pageOffset
      return state.chosenConversationContent.slice(startIdx, startIdx + state.pageOffset)
    }
  }
}
