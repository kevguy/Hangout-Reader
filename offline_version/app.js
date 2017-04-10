let GLOBAL_conversations = undefined;

function createVueStuff(){
	
	let store = {
		state: {
			conversation_list: [],
			history: [],
			// history: GLOBAL_conversations.get('UgydvFWht1Ixy0TAJ-N4AaABAQ'),
			// history: conversations.get('UgylVwHUsKjYT5sSElJ4AaABAQ'),
			chosen_conversation_id: 0,
			enable_table_mode: false
		}
	}

	Vue.component('settings-vue', {
		template: '#settings-vue-component',
		data: function(){
			return store.state;
		},
		methods: {
			closeSettingsDialog(){
				let el = document.querySelector('.setting-dialog');
				el.classList.add("setting-not-visible");
			}
		}
	})

	Vue.component('menu-vue', {
		template: '#menu-vue-component',
		data: function(){
			return store.state;
		},
		methods: {
			dummy(conv_id){
				console.log(conv_id);
				this.$root.$data.chosen_conversation_id = conv_id;
				let el = document.querySelector('.mdl-layout__obfuscator');
				el.click();
			},
			openSettingsDialog(){
				let settingEl = document.querySelector('.setting-dialog');
				settingEl.classList.remove("setting-not-visible");
				let el = document.querySelector('.mdl-layout__obfuscator');
				el.click();
			}
		}
	});

	Vue.component('detail-vue', {
		template: '#detail-vue-component',
		data: function(){
			return {
				sharedState: this.$root.$data,
				chosen_conversation_id: 0,
				enable_table_mode: false
			}
		},
		watch: {
		    sharedState: {
	          deep: true,
	          handler: function(){
	          	console.log('handling');
	          	if (this.$root.$data.chosen_conversation_id != this.chosen_conversation_id){
	          		console.log('oh shit');
	          		this.chosen_conversation_id = this.$root.$data.chosen_conversation_id;
	          		this.$root.$data.history = GLOBAL_conversations.get(this.chosen_conversation_id);
	          	}
	          	if (this.$root.$data.enable_table_mode != this.enable_table_mode){
	          		console.log(this.$root.$data.enable_table_mode);
	          		this.enable_table_mode = this.$root.$data.enable_table_mode;
	          	}
	          }
        	},
        	// chosen_conversation_id: function(newVal){
        	// 	console.log('new value is ', newVal);
        	// }
		},
		methods: {
			dummy(){

			}
		}
	});

	let testApp = new Vue({
	    el: '#app',
	    data: store.state
	  });

	console.log('Vue comes in!');
	return testApp;
}











let ALL_PARTICIPANTS = {};
let CONVERSATION_LIST = [];
let CONVERSATIONS = {};

let nameByConversationMap = new Map();


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
	let g_conversation_list = data['conversation_state'];



	let conversationList = g_conversation_list.map(function(item){
		let g_participant_data = item['conversation_state']['conversation']['participant_data'];
		let g_conversation_id = item['conversation_id']['id'];

		// Get all participants
		let participants = g_participant_data.map(function(participant){
			if(!participant['fallback_name'] || participant['fallback_name'] == null){
				let unknown_constant = -1;
				ALL_PARTICIPANTS[unknown_constant] = {};
				ALL_PARTICIPANTS[unknown_constant][g_conversation_id] = 'Unknown';

				return {
					name_id: -1,
					name: 'Unknown'
				};
			} else {
				let fallback_name = participant['fallback_name'];
				let gaia_id = participant['id']['gaia_id'];

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
	let conversation_states = data['conversation_state'];

	let result = conversation_states.map(function(item){
		let g_conversation_id = item['conversation_id']['id'];
		let g_events = item['conversation_state']['event'];

		let history = g_events.map(function(event){
			let timestamp = event['timestamp'];
			let msgtime = formatTimestamp(timestamp);
			let sender = event['sender_id']['gaia_id'];
			let sender_name = 'Unknown';
			let content = {};

			if (event['chat_message']){
				let chatMsg = event['chat_message'];
				let segments = chatMsg['message_content']['segment'];
				let attachments = chatMsg['message_content']['attachment'];
				
				// Try and get messages
				if (segments){
					content.message = segments.reduce(function(acc, segment){
						if (segment['text']){
							return acc + twemoji.parse(segment['text']);
						}
					}, '');
					// console.log(content.message);

				} else {
					content.message = '';
				}

				// Try and get photos
				if (attachments){
					content.photo = attachments.map(function(attachment){
						if (attachment['embed_item']['type'][0] == "PLUS_PHOTO"){
							return { 
								url: attachment['embed_item']['embeds.PlusPhoto.plus_photo']['url'],
								thumbnail: attachment['embed_item']['embeds.PlusPhoto.plus_photo']['thumbnail']['image_url']
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

			} else if (event['event_type'] === 'HANGOUT_EVENT'){
				content.message = '';
				content.photo = {
					url:'',
					thumbnail: ''
				};
				console.log(event['hangout_event']);
				if (event['hangout_event']['media_type'] === 'AUDIO_ONLY'){
					if (event['hangout_event']['hangout_duration_secs']){
						content.message = 'Voice Call: ' + event['hangout_event']['hangout_duration_secs'] + ' seconds';	
					} else {
						content.message = 'Failed voice call.';
					}
				} else if (event['hangout_event']['media_type'] === 'AUDIO_VIDEO') {
					if (event['hangout_event']['hangout_duration_secs']){
						content.message = 'Video Call: ' + event['hangout_event']['hangout_duration_secs'] + ' seconds';	
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
			if(keyA < keyB) return -1;
			if(keyA > keyB) return 1;
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






























function createSelectImageStream(elementId){
	var container = '#' + elementId;


	var appLogoInputElement = document.querySelector(container + ' input[type="file"].kev-inputFile');
	var appLogoInputFileNameElement = document.querySelector(container + ' input[type="text"].kev-inputFileName');
	var appLogoCancelBtn = document.querySelector(container + ' button.kev-cancelBtn');
	var dropbox = document.querySelector(container + ' div.kev-dropzone');
	var previewElement = document.querySelector(container + ' .kev-img-container > img.kev-preview');
	var dropMsgElement = document.querySelector(container + ' .kev-drop-msg');
	console.log(dropMsgElement);
	var uploadPreviewElement = document.querySelector(container + ' .kev-upload-preview');
	var uploadBtn = document.querySelector(container + ' .kev-inputFile-btn');


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
		vueInstance.conversation_list = CONVERSATION_LIST;
		GLOBAL_conversations = conversations;

		

		let el = document.querySelector('.upload-status');
		el.classList.remove('upload-complete-not-visible');

		el = document.querySelector('.upload-progress-bar');
		el.classList.add('progress-bar-not-visible');

		el = document.querySelector('.upload-dialog');
		el.classList.add('upload-not-visible');

		let snackbar = document.querySelector('#load-complete');
		let snackbarData = {
	      message: 'JSON loaded',
	      timeout: 10000000000,
	      actionHandler: function(event){snackbar.classList.remove('mdl-snackbar--active')},
	      actionText: 'Close'
	    };
    	snackbar.MaterialSnackbar.showSnackbar(snackbarData);

    	el = document.querySelector('.mdl-layout__drawer-button');
    	el.click();

	}


	function createLoadFileStream(files){
		let fileList = files;

		if (fileList){
			let file = fileList[0];

			if (file){
				appLogoInputFileNameElement.value = file.name;
				return Rx.Observable.create(function(observer){
					var reader = new FileReader();
					reader.readAsText(file, "UTF-8");

					reader.onload = function(evt){
						console.log("Loaded: " + evt.target.result.length);
						observer.next(evt.target.result);
					}

					reader.onerror = function(err){
						observer.error(err);
						alert("Error ");
					}
				});
			} else {
				return Rx.Observable.just(0);
			}
		} else {
			return Rx.Observable.just(0);
		}
	}

	let uploadBtnStream = Rx.Observable.create(function(o){
			uploadBtn.addEventListener('click', function(e){
				o.next({event: e, context: this, action:'click'});
			}, false);
		})
		.do(function(response){
			appLogoInputElement.click();
		});

	let uploadStream = Rx.Observable.create(function(o){
			appLogoInputElement.addEventListener("change", function(e){
				o.next({event: e, context: this, action: 'change'});
			}, false);
		})
		.flatMap(function(response){
			let el = document.querySelector('.upload-progress-bar');
			el.classList.remove('progress-bar-not-visible');
			return createLoadFileStream(response.context.files);
		})
		.do(function(response){
			if (response !== 0){
				handleFile(response);
			}
		});

	let dragenterStream = Rx.Observable.create(function(o){
			dropbox.addEventListener("dragenter", function(e){
				e.stopPropagation();
	  			e.preventDefault();
				o.next({event: e, context: this, action: 'dragenter'});
			}, false);
		});

	let dragleaveStream = Rx.Observable.create(function(o){
			dropbox.addEventListener('dragleave', function(e){
				e.stopPropagation();
	  			e.preventDefault();
	  			dropbox.classList.remove('kev-dragover');
	  			previewElement.classList.remove('kev-dragover');
				o.next({event: e, context: this, action: 'dragleave'});
			}, false);
	});

	let dragoverStream = Rx.Observable.create(function(o){
		dropbox.addEventListener('dragover', function(e){
			e.stopPropagation();
			e.preventDefault();
			dropbox.classList.add('kev-dragover');
			previewElement.classList.add('kev-dragover');
			o.next({event: e, context: this, action: 'dragover'});
		}, false);
	});

	let dropStream = Rx.Observable.create(function(o){
		dropbox.addEventListener('drop', function(e){
			e.stopPropagation();
			e.preventDefault();

			let dt = e.dataTransfer;
			let files = dt.files;

			let el = document.querySelector('.upload-progress-bar');
			el.classList.remove('progress-bar-not-visible');

			o.next({event: e, context: this, action: 'drop', files: files});

		}, false);
	})
	.flatMap(function(response){
		return createLoadFileStream(response.files);
	})
	.do(function(response){
		if (response !== 0){
			handleFile(response);
			dropbox.classList.remove('kev-dragover');
			previewElement.classList.remove('kev-dragover');
			dropbox.classList.remove('kev-init');
		}
	});

	// let cancelStream = Rx.Observable.create(function(o){
	// 	appLogoCancelBtn.addEventListener('click', function(e){
	// 		 appLogoInputElement.value = '';
	// 		previewElement.file = undefined;
	// 		previewElement.src='';

	// 		appLogoInputFileNameElement.value = '';

	// 		dropbox.classList.add('kev-init');

	// 		o.next({event: e, context: this, action: 'cancel'});
	// 	}, false);
	// });

	let intervalStream = Rx.Observable
						    .interval(2000 /* ms */)
						    .timeInterval();

	let selectImageStream = Rx.Observable.merge(uploadBtnStream,
										uploadStream, 
										dragenterStream,
										dragleaveStream,
										dragoverStream, 
										dropStream);
										//cancelStream);

	return selectImageStream;
}





let vueInstance = createVueStuff();

var dialog = document.querySelector('#modal-example');
var closeButton = dialog.querySelector('button');
var showButton = document.querySelector('#show-modal-example');
if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
var closeClickHandler = function(event) {
    dialog.close();
};
var showClickHandler = function(event) {
    dialog.showModal();
};
showButton.addEventListener('click', showClickHandler);
closeButton.addEventListener('click', closeClickHandler);

let stream = createSelectImageStream('app-logo-container', vueInstance);
stream.subscribe(function(response){
	console.log(response);
});