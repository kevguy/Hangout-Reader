/* global self */
/* eslint no-restricted-globals: ["off", "self"] */

import hangoutReader from '../hangout-reader';

function handleJsonFile(file) {
  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');

  reader.onload = (worker => function onload(evt) {
    // console.log("Loaded: " + evt.target.result.length);
    const { conversationList, conversations } = hangoutReader(evt.target.result);

    worker.postMessage({
      action: 'HANDLE_JSON_FILE',
      payload: {
        conversationList,
        conversations,
      },
    });
  })(self);
}

self.onmessage = (e) => {
  if (e.data.file && e.data.action === 'HANDLE_JSON_FILE') {
    handleJsonFile(e.data.file);
  }
};
