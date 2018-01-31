/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

import { Observable } from 'rxjs/Rx';

export default {
  state: {
    initialized: false,
    chosenId: 0,
    participants: [],
    history: [],
    pageOffset: 50,
    currentPageNo: 0,
  },
  mutations: {
    initialization(state) { state.initialized = true; },
    updateChosenId(state, conversationId) { state.chosenId = conversationId; },
    updateParticipants(state, participants) { state.participants = participants; },
    updateChatHistory(state, conversation) { state.history = conversation; },
    updateCurrentPageNo(state, num) { state.currentPageNo = num; },
    incrementCurrentPageNo(state) { state.currentPageNo += 1; },
    decrementCurrentPageNo(state) { state.currentPageNo -= 1; },
  },
  getters: {
    numOfMsgs: state => state.history.length,
    numOfPages: (state, getters) => {
      const num = Math.floor(getters.numOfMsgs / state.pageOffset);
      if (((getters.numOfMsgs) % (state.pageOffset)) > 0) {
        return num + 1;
      }
      return num;
    },
    msgsToShow: (state) => {
      const startIdx = (state.currentPageNo - 1) * state.pageOffset;
      return state.history.slice(startIdx, startIdx + state.pageOffset);
    },
  },
  actions: {
    UPDATE_CHAT_HISTORY({ dispatch, commit, rootState }, conversationId) {
      const participants = rootState.conversationList
        .filter(item => item.id === conversationId)[0].participants;

      const picList = participants.filter(participant =>
        !Object.prototype.hasOwnProperty.call(rootState.profileImgs.profileMap, participant.id));

      commit('updateChosenId', conversationId);
      commit('updateParticipants', participants);
      commit('updateChatHistory', rootState.conversations[conversationId]);
      commit('updateCurrentPageNo', 1);
      commit('initialization');

      if (picList.length > 0) {
        const streams = participants.map(participant =>
          Observable.fromPromise(dispatch('RETRIEVE_PROFILE_PIC', participant.id)));

        return Observable.merge(...streams).toPromise();
      }
      return undefined;
    },
  },
};
