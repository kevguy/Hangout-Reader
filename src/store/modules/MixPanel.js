export default {
  // namespaced: true,
  state: {
    mixPanelInstance: null,
    mixPanelProfileId: '12345678',
  },
  mutations: {
    setMixPanelInstance(state, payload) { state.mixPanelInstance = payload },
    setMixPanelProfileId(state, payload) { state.mixPanelProfileId = payload }
  }
}
