/*jslint node: true */
'use strict';

// importScripts('https://cdnjs.cloudflare.com/ajax/libs/twemoji/1.2.1/twemoji.min.js');
var twemoji = require('twemoji');

// var self = typeof self === 'undefined' ? '' : self;

let ALL_PARTICIPANTS = {};
let CONVERSATION_LIST = [];
let CONVERSATIONS = {};

// let nameByConversationMap = new Map();


function zeroPad(string) {
	return (string < 10) ? "0" + string : string;
}

function formatTimestamp(timestamp) {
	var d = new Date(timestamp/1000);
	var formattedDate = d.getFullYear() + "-" +
	    zeroPad(d.getMonth() + 1) + "-" +
	    zeroPad(d.getDate());
	var hours = zeroPad(d.getHours());
	var minutes = zeroPad(d.getMinutes());
	var formattedTime = hours + ":" + minutes;
	return formattedDate + " " + formattedTime;
}



function getParticipantsAndConversationList(data){
	let g_conversation_list = data.conversation_state;



	let conversationList = g_conversation_list.map(function(item){
		let g_participant_data = item.conversation_state.conversation.participant_data;
		let g_conversation_id = item.conversation_id.id;

		// Get all participants
		let participants = g_participant_data.map(function(participant){
			if(!participant.fallback_name || participant.fallback_name === null){
				let unknown_constant = -1;
				ALL_PARTICIPANTS[unknown_constant] = {};
				ALL_PARTICIPANTS[unknown_constant][g_conversation_id] = 'Unknown';

				return {
					name_id: -1,
					name: 'Unknown'
				};
			} else {
				let fallback_name = participant.fallback_name;
				let gaia_id = participant.id.gaia_id;

				if (ALL_PARTICIPANTS[gaia_id]){
					ALL_PARTICIPANTS[gaia_id][g_conversation_id] = fallback_name;
				} else {
					ALL_PARTICIPANTS[gaia_id] = {};
					ALL_PARTICIPANTS[gaia_id][g_conversation_id] = fallback_name;
				}

				return {
					name_id: gaia_id,
					name: fallback_name
				};

			}

		});

		let list = '';
		participants.map(function(item){
			list = list + ', ' + item.name;
		});
		list = list.substr(2);

		// let list = participants.reduce(function(acc, val){
		// 	console.log(acc.name);
		// 	return val + ', ' + acc.name;
		// }, '');
		// console.log(list);

		return {
			id: g_conversation_id, 
			participants,
			list
		};

	});

	return conversationList;
}


function getConversations(data){
	let conversation_states = data.conversation_state;

	let result = conversation_states.map(function(item){
		let g_conversation_id = item.conversation_id.id;
		let g_events = item.conversation_state.event;

		let history = g_events.map(function(event){
			let timestamp = event.timestamp;
			let msgtime = formatTimestamp(timestamp);
			let sender = event.sender_id.gaia_id;
			let sender_name = 'Unknown';
			let content = {};

			if (event.chat_message){
				let chatMsg = event.chat_message;
				let segments = chatMsg.message_content.segment;
				let attachments = chatMsg.message_content.attachment;
				
				// Try and get messages
				if (segments){
					content.message = segments.reduce(function(acc, segment){
						if (segment.text){
							return acc + twemoji.parse(segment.text);
						}
					}, '');
					// console.log(content.message);

				} else {
					content.message = '';
				}

				// Try and get photos
				if (attachments){
					content.photo = attachments.map(function(attachment){
						if (attachment.embed_item.type[0] === "PLUS_PHOTO"){
							return { 
								url: attachment.embed_item['embeds.PlusPhoto.plus_photo'].url,
								thumbnail: attachment.embed_item['embeds.PlusPhoto.plus_photo'].thumbnail.image_url
							};
						} else {
							return {
								url: '',
								thumbnail: ''
							};
						}
					});
					// seems like only one photo shows up every time
					content.photo = content.photo[0];
					// console.log(content.photo);
					// 

				} else {
					content.photo = {
						url:'',
						thumbnail: ''
					};
				}

			} else if (event.event_type === 'HANGOUT_EVENT'){
				content.message = '';
				content.photo = {
					url:'',
					thumbnail: ''
				};
				console.log(event.hangout_event);
				if (event.hangout_event.media_type === 'AUDIO_ONLY'){
					if (event.hangout_event.hangout_duration_secs){
						content.message = 'Voice Call: ' + event.hangout_event.hangout_duration_secs + ' seconds';	
					} else {
						content.message = 'Failed voice call.';
					}
				} else if (event.hangout_event.media_type === 'AUDIO_VIDEO') {
					if (event.hangout_event.hangout_duration_secs){
						content.message = 'Video Call: ' + event.hangout_event.hangout_duration_secs + ' seconds';	
					} else {
						content.message = 'Failed video call.';
					}
					
				}

			} else {
				content.message = '';
				content.photo = {
						url:'',
						thumbnail: ''
					};
			}

			if (ALL_PARTICIPANTS[sender]){
				sender_name = ALL_PARTICIPANTS[sender][g_conversation_id];
			}

			return {
				// msgTime: msgTime,
				sender_id: sender,
				sender_name,
				timestamp,
				msgtime, 
				content
			};

		});

		// Sort events by timestamp
		history.sort(function(a, b){
			var keyA = a.timestamp,
			    keyB = b.timestamp;
			if( keyA < keyB ) {
				return -1;
			}
			if( keyA > keyB ) {
				return 1;
			}
			return 0;
		});

		// console.log(conversationList[id]);
		// conversationList[id].history = history;

		return {
			conversation_id: g_conversation_id,
			history
		};

	});

	return result;
}








function handleFile(data){

	let Hangouts = JSON.parse(data);
	// let result = awesome.data_preprocess(Hangouts);
	CONVERSATION_LIST = getParticipantsAndConversationList(Hangouts);
	CONVERSATIONS = getConversations(Hangouts);
	console.log(CONVERSATION_LIST);
	console.log(CONVERSATIONS);
	// console.log(result.conversation_list);
	// console.log(result.conversations);
	// console.log(result.all_participants);
	
	let conversations = new Map();
	CONVERSATIONS.map(function(item){
		console.log(item.conversation_id);
		conversations.set(item.conversation_id, item.history);	
	});
	// console.log(conversations.get('UgylVwHUsKjYT5sSElJ4AaABAQ'));


	// createVueStuff(CONVERSATION_LIST, conversations);
	// vueInstance.conversation_list = CONVERSATION_LIST;
	// GLOBAL_conversations = conversations;

	return [CONVERSATION_LIST, conversations];
	

	// let el = document.querySelector('.upload-status');
	// el.classList.remove('upload-complete-not-visible');

	// el = document.querySelector('.upload-progress-bar');
	// el.classList.add('progress-bar-not-visible');

	// el = document.querySelector('.upload-dialog');
	// el.classList.add('upload-not-visible');

	// let snackbar = document.querySelector('#load-complete');
	// let snackbarData = {
 //      message: 'JSON loaded',
 //      timeout: 10000000000,
 //      actionHandler: function(event){snackbar.classList.remove('mdl-snackbar--active')},
 //      actionText: 'Close'
 //    };
	// snackbar.MaterialSnackbar.showSnackbar(snackbarData);

	// el = document.querySelector('.mdl-layout__drawer-button');
	// el.click();

}




self.onmessage = function(e) {
	self.postMessage("web worker says hi");
	
	console.log('someone sent me sth!');

	if (e.data.file){
		self.postMessage("see a file");

		var file = e.data.file;
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");

		console.log("started reading file");

		reader.onload = (function(worker){
			return function(evt){

				console.log("Loaded: " + evt.target.result.length);
				// observer.next(evt.target.result);
				let result = handleFile(evt.target.result);

				// createVueStuff(CONVERSATION_LIST, conversations);
				let conversation_list = result[0];
				let conversations = result[1];


				console.log("just finish reading file");
				worker.postMessage({
					conversation_list,
					conversations
				});
			};
		})(self);

		reader.onerror = (function(worker){
			return function(err){
				console.log(err);
				console.log("just finish reading file error");
				worker.postMessage("Read kev error");
			};
		})(self);
	}
};
