/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

export default {
  state: {
    mode: 'normal',
    showPerson: true,
    showPicture: true,
    showMsg: true,
    showTime: true,
    showDialog: false,
  },
  mutations: {
    updateMode(state, mode) {
      state.mode = mode;
    },
    showSettingsDialog(state, val) {
      state.showDialog = val;
    },
  },
};
