/* jslint no-console: "error" */
/* eslint no-console: "error" */

// const fs = require('fs');
// const twemoji = require('twemoji');
import twemoji from 'twemoji';

const UNKNOWN_CONSTANT = -1;

function zeroPad(string) {
  return (string < 10) ? `0${string}` : string;
}

function formatTimestamp(timestamp) {
  const d = new Date(timestamp / 1000);
  const formattedDate = `${d.getFullYear()}-${zeroPad(d.getMonth() + 1)}-${zeroPad(d.getDate())}`;
  const hours = zeroPad(d.getHours());
  const minutes = zeroPad(d.getMinutes());
  const formattedTime = `${hours}:${minutes}`;
  return `${formattedDate} ${formattedTime}`;
}

function getParticipantList(hangoutsData) {
  const participantList = {};
  participantList[UNKNOWN_CONSTANT] = {};

  hangoutsData.conversation_state
    .forEach((item) => {
      const participantData = item.conversation_state.conversation.participant_data;
      const conversationId = item.conversation_id.id;

      // Get all participants
      participantData
        .forEach((participant) => {
          if (!participant.fallback_name || participant.fallback_name === null) {
            participantList[UNKNOWN_CONSTANT][conversationId] = 'Unknown';
          } else {
            const fallbackName = participant.fallback_name;
            const gaiaId = participant.id.gaia_id;

            if (participantList[gaiaId]) {
              participantList[gaiaId][conversationId] = fallbackName;
            } else {
              participantList[gaiaId] = {};
              participantList[gaiaId][conversationId] = fallbackName;
            }
          }
        });
    });

  return participantList;
}

function getConversationList(hangoutsData) {
  const conversationList = hangoutsData.conversation_state
    .map((item) => {
      const participantData = item.conversation_state.conversation.participant_data;
      const conversationId = item.conversation_id.id;
      let type = 'chat';
      let groupName;

      if (item.conversation_state.conversation.type === 'GROUP') {
        type = 'group';
        groupName = '' || item.conversation_state.conversation.name;
      }

      // Get all participants
      const participants = participantData.map((participant) => {
        if (!participant.fallback_name || participant.fallback_name === null) {
          return {
            id: -1,
            name: 'Unknown',
          };
        }
        const fallbackName = participant.fallback_name;
        const gaiaId = participant.id.gaia_id;

        return {
          id: gaiaId,
          name: fallbackName,
        };
      });

      let list = participants.reduce((acc, participant) =>
        `${acc}, ${participant.name}`, '');
      list = list.substr(2);

      return {
        id: conversationId,
        participants,
        list,
        type,
        groupName,
      };
    });

  return conversationList;
}

function getConversations(hangoutsData, participantList) {
  const result = hangoutsData.conversation_state
    .map((item) => {
      const conversationId = item.conversation_id.id;
      const events = item.conversation_state.event;

      const history = events.map((event) => {
        const { timestamp } = event;
        const msgTime = formatTimestamp(timestamp);
        const sender = event.sender_id.gaia_id;
        let senderName = 'Unknown';
        const content = {
          message: '',
          photo: {
            url: '',
            thumbnail: '',
          },
        };

        if (event.chat_message) {
          const chatMsg = event.chat_message;
          const segments = chatMsg.message_content.segment;
          const attachments = chatMsg.message_content.attachment;

          // Try and get messages
          if (segments) {
            content.message = segments.reduce((acc, segment) => {
              if (segment.text) {
                return acc + twemoji.parse(segment.text);
              }
              return acc;
            }, '');
          }

          // Try and get photos
          if (attachments) {
            content.photo = attachments.map((attachment) => {
              if (attachment.embed_item.type[0] === 'PLUS_PHOTO') {
                return {
                  url: attachment.embed_item['embeds.PlusPhoto.plus_photo'].url,
                  thumbnail: attachment.embed_item['embeds.PlusPhoto.plus_photo'].thumbnail.image_url,
                };
              }
              return {
                url: '',
                thumbnail: '',
              };
            });
            // seems like only one photo shows up every time
            const [photo] = content.photo;
            content.photo = photo;
          }
        } else if (event.event_type === 'HANGOUT_EVENT') {
          if (event.hangout_event.media_type === 'AUDIO_ONLY') {
            if (event.hangout_event.hangout_duration_secs) {
              content.message = `Voice Call: ${event.hangout_event.hangout_duration_secs} seconds`;
            } else {
              content.message = 'Failed voice call.';
            }
          } else if (event.hangout_event.media_type === 'AUDIO_VIDEO') {
            if (event.hangout_event.hangout_duration_secs) {
              content.message = `Video Call: ${event.hangout_event.hangout_duration_secs} seconds`;
            } else {
              content.message = 'Failed video call.';
            }
          }
        }

        if (participantList[sender]) {
          senderName = participantList[sender][conversationId];
        }

        return {
          // msgTime: msgTime,
          senderId: sender,
          senderName,
          timestamp,
          msgTime,
          content,
        };
      });

      // Sort events by timestamp
      history.sort((a, b) => {
        const keyA = a.timestamp;
        const keyB = b.timestamp;
        if (keyA < keyB) { return -1; }
        if (keyA > keyB) { return 1; }
        return 0;
      });

      return {
        conversation_id: conversationId,
        history,
      };
    });

  return result;
}

export default function parsefile(data) {
  const hangoutsData = JSON.parse(data);
  const participantList = getParticipantList(hangoutsData);
  const conversationList = getConversationList(hangoutsData);
  const conversations = getConversations(hangoutsData, participantList);
  return { conversationList, conversations };
}
