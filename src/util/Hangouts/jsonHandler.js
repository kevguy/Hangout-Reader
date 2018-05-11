/* jslint no-console: "error" */
/* eslint no-console: "error" */

// const fs = require('fs');
// const twemoji = require('twemoji');
// import twemoji from 'twemoji';

const UNKNOWN_CONSTANT = -1;

function removeDuplicates(arr) {
  return arr.filter((item, pos) => arr.indexOf(item) === pos);
}

// https://stackoverflow.com/questions/31337370/how-to-convert-seconds-to-hhmmss-in-moment-js
function pad(num) {
  return (`0${num}`).slice(-2);
}

function hhmmss(secs) {
  let minutes = Math.floor(secs / 60);
  secs = secs%60;
  const hours = Math.floor(minutes / 60);
  minutes = minutes%60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

/**
 * Helper function for formatting timestamps by
 * inserting zero for a single-digit number
 * @param {Number} num the number
 * @returns {String | Number} the number that's zero-padded
 */
function zeroPad(num) {
  return (num < 10) ? `0${num}` : num;
}

/**
 * Format the timestamp into YYYY-MM-DD HH:MM format
 * @param {Number} timestamp the timestamp
 * @returns {String} formatted date string
 */
function formatTimestamp(timestamp) {
  const d = new Date(timestamp / 1000);
  const formattedDate = `${d.getFullYear()}-${zeroPad(d.getMonth() + 1)}-${zeroPad(d.getDate())}`;
  const hours = zeroPad(d.getHours());
  const minutes = zeroPad(d.getMinutes());
  const formattedTime = `${hours}:${minutes}`;
  return `${formattedDate} ${formattedTime}`;
}

/**
 * Retrieves the conversation ID from given conversation
 * @param {Object} conversation the conversation from Hangouts.json
 * @returns {String} the conversation ID
 */
function getConversationId(conversation) {
  // There are two ways to retrieve conversation id
  // Method 1
  return conversation.conversation.conversation_id.id;

  // Method 2
  // return conversation.conversation.conversation.id.id;
}

/**
 * Retrieves the type of the conversation (if it's a group chat or not)
 * @param {Object} conversation the conversation from Hangouts.json
 * @return {Object} resultant info, contains group name if it's a group chat
 */
function getConversationType(conversation) {
  // STICKY_ONE_TO_ONE or GROUP
  return conversation.conversation.conversation.type === 'GROUP' ?
    {
      type: 'group',
      groupName: conversation.conversation.conversation.name === undefined ?
        'Unknown Group' :
        conversation.conversation.conversation.name,
    } :
    { type: 'individual' };
}

/**
 * Retrieves the gaia_id of the user themselves in the conversation
 * @param {Object} conversation the conversation from Hangouts.json
 * @return {String} the gaia_id
 */
function getUserId(conversation) {
  // 116725099929439898086
  return conversation
    .conversation
    .conversation
    .self_conversation_state
    .self_read_state
    .participant_id.gaia_id;
}

/**
 * Retrieves list of participants based on given conversation
 * @param {Object} conversation the conversation from Hangouts.json
 * @returns {[Object]} an array with the infor of the participants
 */
function getParticipants(conversation) {
  const participants = conversation
    .conversation
    .conversation
    .participant_data;

  return participants.map(participant => ({
    gaiaId: participant.id.gaia_id,
    name: participant.fallback_name,
  }));
}

/**
 * Update participantList with new conversation.
 * This is necessary because same Google Account
 * may have different names in different conversations
 * @param {Object} participantList the object-to-be-updated
 * @param {Object} conversation the conversation for updating
 */
function updateParticipantList(participantList, conversation) {
  const conversationId = getConversationId(conversation);
  const participants = getParticipants(conversation);

  const newList = { ...participantList };
  participants.forEach((participant) => {
    if (!participant.name) {
      // Google Account doesn't have a name
      newList[UNKNOWN_CONSTANT][conversationId] = 'Unknown';
    } else if (newList[participant.gaiaId]) {
      // Google Account already exists in participantList
      // so log down the name in this conversation
      newList[participant.gaiaId][conversationId] = participant.name;
    } else {
      // Google Account doesn't exist in participantList
      // so create a new entry for this conversation
      newList[participant.gaiaId] = {};
      newList[participant.gaiaId][conversationId] = participant.name;
    }
  });

  return newList;
}

/**
 * Retreieves information about the conversation
 * @param {Object} conversation the conversation from Hangouts.json
 * @returns {Object} resultant object that contains
 * conversation id and type, (group name, if there's any),
 * participants and list of participants in a single string
 */
function getConversationInfo(conversation) {
  const conversationId = getConversationId(conversation);
  const participants = getParticipants(conversation);
  const conversationType = getConversationType(conversation);
  const user = getUserId(conversation);
  let list = participants.reduce((acc, participant) => (
    participant.gaiaId === user ? `${acc}` : `${acc}, ${participant.name}`
  ), '');
  list = list.substr(2);

  return {
    ...conversationType,
    id: conversationId,
    participants,
    list,
    user,
  };
}

/**
 * Create a message for handling event type ADD_USER
 * @param {Object} event the message data
 * @param {Object} participantList the participant list for looking up names
 * @returns {String} the resultant message
 */
function getAddUsersMsg(event, participantList) {
  const conversationId = event.conversation_id.id;
  const subjectId = event.sender_id.gaia_id;
  const subjectName = participantList[subjectId] ?
    participantList[subjectId][conversationId] :
    'Unknown';

  const objectIds = event.membership_change.participant_id;
  let objectIdList = objectIds
    .map(obj => (
      participantList[obj.gaia_id] ?
        participantList[obj.gaia_id][conversationId] :
        'Unknown'
    ))
    .reduce((acc, name) => `${acc}, ${name}`, '');
  objectIdList = objectIdList.substr(2);

  return `${subjectName} added ${objectIdList} into the group`;
}

/**
 * Create a message for handling event type HANGOUT_EVENT
 * @param {Object} event the message data
 * @param {Object} participantList the participant list for looking up names
 * @returns {String} the resultant message
 */
function getHangoutEventMsg(event, participantList) {
  const conversationId = event.conversation_id.id;
  const subjectId = event.sender_id.gaia_id;
  const subjectName = participantList[subjectId] ?
    participantList[subjectId][conversationId] :
    'Unknown';

  const hangoutType = event.hangout_event.event_type; // START_HANGOUT, END_HANGOUT
  const duration = event.hangout_event.hangout_duration_secs;
  const mediaType = event.hangout_event.media_type; // AUDIO_VIDEO, AUDIO_ONLY,

  const objectIds = event.hangout_event.participant_id;
  let objectIdList = objectIds
    .map(obj => (
      participantList[obj.gaia_id] ?
        participantList[obj.gaia_id][conversationId] :
        'Unknown'
    ))
    .reduce((acc, name) => `${acc}, ${name}`, '');
  objectIdList = objectIdList.substr(2);

  if (mediaType) {
    if (hangoutType === 'START_HANGOUT') {
      // START_HANGOUT
      return `${subjectName} started a ` +
        `${mediaType === 'AUDIO_VIDEO' || !mediaType ? 'video' : 'voice'} chat.\n` +
        `Participant(s): ${objectIdList}`;
    } else if (hangoutType === 'END_HANGOUT') {
      // END_HANGOUT
      return `${subjectName} ended a ` +
        `${mediaType === 'AUDIO_VIDEO' || !mediaType ? 'video' : 'voice'} chat.\n` +
        `Participant(s): ${objectIdList}\n` +
        `Duration: ${hhmmss(duration)}`;
    }
  }
  return event;
}

/**
 * Create a message for handling event type REMOVE_USER
 * @param {Object} event the message data
 * @param {Object} participantList the participant list for looking up names
 * @returns {String} the resultant message
 */
function getRemoveUsersMsg(event, participantList) {
  const conversationId = event.conversation_id.id;
  const subjectId = event.sender_id.gaia_id;
  const subjectName = participantList[subjectId] ?
    participantList[subjectId][conversationId] :
    'Unknown';

  const objectIds = event.membership_change.participant_id;
  let objectIdList = objectIds
    .map(obj => (
      participantList[obj.gaia_id] ?
        participantList[obj.gaia_id][conversationId] :
        'Unknown'
    ))
    .reduce((acc, name) =>
      `${acc}, ${name}`, '');
  objectIdList = objectIdList.substr(2);

  return `${subjectName} removed ${objectIdList} from the group`;
}

/**
 * Create a message for handling event type RENAME_CONVERSATION
 * @param {Object} event the message data
 * @param {Object} participantList the participant list for looking up names
 * @returns {String} the resultant message
 */
function getRenameGroupMsg(event, participantList) {
  const conversationId = event.conversation_id.id;
  const subjectId = event.sender_id.gaia_id;
  const subjectName = participantList[subjectId] ?
    participantList[subjectId][conversationId] :
    'Unknown';
  const { oldName, newName } = event.conversation_rename;

  return `${subjectName} renamed group name from ${oldName} to ${newName}`;
}

/**
 * Handles custom events, especially HANGOUT_EVENT, ADD_USER, REMOVE_USER,
 * and RENAME_CONVERSATION.
 * @param {Object} event the event object
 * @param {Object} participantList the participant list for looking up names
 * @returns {String} the message-to-be-displayed
 */
function handleCustomEvent(event, participantList) {
  switch (event.event_type) {
    // case 'REGULAR_CHAT_MESSAGE':
    //   return '';
    case 'HANGOUT_EVENT':
      return getHangoutEventMsg(event, participantList);
    case 'ADD_USER':
      return getAddUsersMsg(event, participantList);
    case 'REMOVE_USER':
      return getRemoveUsersMsg(event, participantList);
    case 'RENAME_CONVERSATION':
      return getRenameGroupMsg(event, participantList);
    default:
      return 'Unhandled event';
  }
}

/**
 * Handles regaulr chat events (REGULAR_CHAT_MESSAGE), which includes
 * hyperlinks (LINK), photos (PHOTO), videos (VIDEO) and texts (TEXT)
 * @param {Object} event the event object
 * @param {Object} participantList the participant list for looking up names
 * @returns {Object} content of the message
 */
function handleChatEvent(event) {
  const chatMessageContent = event.chat_message.message_content;
  let payload = {};
  if (chatMessageContent.segment) {
    // It's a text message
    // There're three types: TEXT, LINE_BREAK and LINK
    // I'm almost always certain the format looks like
    // { type: '...', text: '...' }
    // And for LINE_BREAK, text is always "\n"
    payload.type = 'text';
    payload.contents = chatMessageContent.segment
      .map(item => ({
        type: item.type === 'LINK' ? 'hyperlink' : 'text',
        content: item.text,
      }));
    return payload;
  }
  // It's probably a photo or video
  const attachment = chatMessageContent.attachment[0];
  const mediaType = attachment.embed_item.plus_photo.media_type;
  if (mediaType === 'PHOTO') {
    const photo = attachment.embed_item.plus_photo;
    payload = {
      type: 'photo',
      thumbnail: photo.thumbnail.url,
      imageUrl: photo.thumbnail.image_url,
      width: photo.thumbnail.width_px,
      height: photo.thumbnail.height_px,
      originalUrl: photo.original_content_url,
    };
    return payload;
  } else if (mediaType === 'VIDEO') {
    const video = attachment.embed_item.plus_photo;
    payload = {
      type: 'video',
      thumbnail: video.thumbnail.url,
      imageUrl: video.thumbnail.image_url,
      width: video.thumbnail.width_px,
      height: video.thumbnail.height_px,
      originalUrl: video.original_content_url,
      downloadUrl: video.download_url,
    };
    return payload;
  }
  return {
    type: 'unknown',
    content: event,
  };
}

function getMessageHistory(conversation, participantList) {
  const conversationId = getConversationId(conversation);
  const historyData = conversation.events
    .map((historyEvent) => {
      const senderId = historyEvent.sender_id.gaia_id;
      const payload = {
        senderId,
        senderName: participantList[senderId] ?
          participantList[senderId][conversationId] :
          'Unknown',
        timestamp: historyEvent.timestamp,
        msgTime: formatTimestamp(historyEvent.timestamp),
      };

      if (historyEvent.event_type !== 'REGULAR_CHAT_MESSAGE') {
        // Handle Custom Events First
        payload.content = handleCustomEvent(historyEvent, participantList);
      } else {
        // Handle Regular Chat Messages (TEXT, LINK, PHOTO, VIDEO)
        payload.content = handleChatEvent(historyEvent);
      }
      return payload;
    })
    .sort((a, b) => {
      const keyA = a.timestamp;
      const keyB = b.timestamp;
      if (keyA < keyB) { return -1; }
      if (keyA > keyB) { return 1; }
      return 0;
    });

  return {
    conversationId,
    history: historyData,
  };
}

export default function parseHangoutsJson(conversations) {
  const conversationList = [];
  const conversationContents = {};
  let participantList = { [UNKNOWN_CONSTANT]: {} };
  conversations.forEach((conversation) => {
    // update conversationList
    conversationList.push(getConversationInfo(conversation));

    // update participantList
    participantList = updateParticipantList(participantList, conversation);

    // update conversationContents
    const result = getMessageHistory(conversation, participantList);
    conversationContents[result.conversationId] = result.history;
  });

  return {
    conversationList,
    conversationContents,
    participantList,
  };
}

// function readHangoutJson() {
//   fs.readFile('./Hangouts.json', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.info('finish reading Hangouts.json');
//
//     const obj = JSON.parse(data);
//     // console.log(obj);
//     const result = parseHangoutsJson(obj.conversations);
//     console.log(JSON.stringify(result.conversationList))
//   });
// }
// readHangoutJson();
// console.info(formatTimestamp("1496156557623887"));
// readHangoutJson();
