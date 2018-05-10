export default {
  // namespaced: true,
  state: {
    drawerOpen: false,
    imageDialogOpen: false,
    messageDialogOpen: false,
    chosenImage: { name: '', url: '' }
  },
  mutations: {
    toggleDrawer(state, payload) { state.drawerOpen = payload },
    toggleImageDialog(state, payload) { state.imageDialogOpen = payload },
    updateChosenImage(state, payload) { state.chosenImage = payload },
    toggleMessageDialog(state, payload) { state.messageDialogOpen = payload }
  }
}
