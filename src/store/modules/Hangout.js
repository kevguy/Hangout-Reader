export default {
  namespaced: true,
  state: {
    profileImgMap: {},
  },
  mutations: {
    initProfileImgMap(state, payload) { state.profileImgMap = payload; },
    setProfileImgUrl(state, payload) {
      state.profileImgMap = {
        ...state.profileImgMap,
        [payload.gaiaId]: payload.result
      }
    }
  }
}
