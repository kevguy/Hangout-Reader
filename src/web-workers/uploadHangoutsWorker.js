/* global self */
/* eslint no-restricted-globals: ["off", "self"] */

import jsonHandler from '../util/Hangouts/jsonHandler';

function handleJsonFile(file) {
  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');

  reader.onload = (worker => function onload(evt) {
    // console.log("Loaded: " + evt.target.result.length);
    const obj = JSON.parse(evt.target.result);
    const { conversationList, conversationContents, participantList } = jsonHandler(obj.conversations);

    worker.postMessage({
      action: 'HANDLE_JSON_FILE',
      payload: {
        conversationList,
        conversationContents,
        participantList
      },
    });
  })(self);
}

self.onmessage = (e) => {
  if (e.data.file && e.data.action === 'HANDLE_JSON_FILE') {
    handleJsonFile(e.data.file);
  }
};
