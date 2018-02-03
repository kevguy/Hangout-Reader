/* global self */
/* eslint no-restricted-globals: ["off", "self"] */

function transformToCSV(history) {
  const csv = ['"SENDER","MESSAGE","PHOTO","TIME"'].concat(history.map(e => `"${e.senderName}","${e.content.message}","${e.content.photo.url}","${e.msgTime}"`)).join('\n');
  self.postMessage({
    action: 'EXPORT_TO_CSV',
    payload: { csv },
  });
}

self.onmessage = (e) => {
  if (e.data.content && e.data.action === 'EXPORT_TO_CSV') {
    transformToCSV(e.data.content);
  }
};
