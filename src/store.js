/* eslint import/no-webpack-loader-syntax: off */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

import chatHistory from '@/modules/chatHistory';
import settings from '@/modules/settings';
import profileImgs from '@/modules/profileImgs';

import { Observable } from 'rxjs/Rx';

// https://stackoverflow.com/questions/43307377/use-worker-loader-with-vue-cli-and-webpack
import Worker from 'worker-loader?name=workers/[hash:7].worker.js!./web-workers/uploadWorker';
import CSVWorker from 'worker-loader?name=workers/[hash:7].worker.js!./web-workers/exportCSVWorker';

import downloadCSV from './utils/downloadCSV';

const worker = new Worker();
const csvWorker = new CSVWorker();

function handleJsonFileStream() {
  return Observable.create((observer) => {
    worker.onmessage = (e) => {
      console.info(e);
      if (e.data.action === 'HANDLE_JSON_FILE') {
        observer.next({ data: e.data.payload });
        observer.complete();
      }
    };
  });
}

function handleCsvFileStream() {
  return Observable.create((observer) => {
    csvWorker.onmessage = (e) => {
      console.info(e);
      if (e.data.action === 'EXPORT_TO_CSV') {
        observer.next({ data: e.data.payload });
        observer.complete();
      }
    };
  });
}

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chatHistory,
    settings,
    profileImgs,
  },
  state: {
    initialized: false,
    conversationList: [],
    conversations: {},
  },
  mutations: {
    initialization(state) {
      state.initialized = true;
    },
    saveConversationList(state, result) {
      state.conversationList = result;
    },
    saveConversations(state, result) {
      const transformation = {};
      result.forEach((conversation) => {
        transformation[conversation.conversation_id] = conversation.history;
      });
      state.conversations = transformation;
    },
  },
  actions: {
    HANDLE_JSON_FILE({ commit }, file) {
      worker.postMessage({
        action: 'HANDLE_JSON_FILE',
        file,
      });

      return handleJsonFileStream().toPromise()
        .then((res) => {
          commit('saveConversationList', res.data.conversationList);
          commit('saveConversations', res.data.conversations);
          commit('initialization');
        });
    },
    // UPDATE_CHAT_HISTORY({ commit }, )
    EXPORT_TO_CSV() {
      csvWorker.postMessage({
        action: 'EXPORT_TO_CSV',
        content: this.state.chatHistory.history,
      });
      console.log('Exporting to CSV');
      return handleCsvFileStream().toPromise()
        .then((res) => {
          // console.log(`res.data: ${res.data.csv}`);
          downloadCSV(res.data.csv);
        });
    },
  },
});
