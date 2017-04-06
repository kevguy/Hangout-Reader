/*jslint node: true */
'use strict';
import {createSelectImageStream} from './selectFileStream';
import Vue from 'Vue';
import dialogPolyfill from 'dialogPolyfill';
// import Rx from 'rxjs/Rx';

var Worker = require("worker!./uploadfile-worker");

let GLOBAL_OBJ = {
	conversations: [],
	imageByGaiaIdMap: new Map()
};

function createVueStuff(worker){
	
	worker.postMessage({msg: 'dvsdv'});

	let store = {
		state: {
			search_results: [],
			conversation_list: [],
			history: [],
			chosen_conversation_id: 0,
			enable_table_mode: false,
			enable_show_person: true,
			enable_show_time: true,
			enable_show_msg: true,
			profileImgByGaiaMap: {}
		}
	};

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
	});

	Vue.component('menu-vue', {
		template: '#menu-vue-component',
		data: function(){
			return store.state;
		},
		methods: {
			switchConv(conv_id){
				this.$root.$data.chosen_conversation_id = conv_id;
				let el = document.querySelector('.mdl-layout__obfuscator');
				el.click();

				this.getProfileImgs();

			},
			openSettingsDialog(){
				let settingEl = document.querySelector('.setting-dialog');
				settingEl.classList.remove("setting-not-visible");
				let el = document.querySelector('.mdl-layout__obfuscator');
				el.click();
			},
			getProfileImgs(){
				let self = this;
				console.log(this.$root.$data.chosen_conversation_id);
				console.log(this.$root.$data.conversation_list[this.$root.$data.chosen_conversation_id]);
				let name_list = this.$root.$data.conversation_list
								.filter(function(conversation){
									return conversation.id === self.$root.$data.chosen_conversation_id;
								})[0]
								.participants.map(function(participant){
									return participant.name_id;
								});
				console.log(name_list);

				worker.onMessage = function(e){
					console.log(e.data);
					if (e.data.action === 'getProfileImgs' && e.data.name_list){
						console.log('got name list from worker');
						this.$root.$data.profileImgByGaiaMap = e.data.name_list;
						console.log(this.$root.$data.profileImgByGaiaMap);
					}
				};


				worker.postMessage({
					action: 'getProfileImgs',
					name_list
				});

			}
		}
	});

	Vue.component('detail-vue', {
		template: '#detail-vue-component',
		data: function(){
			return {
				sharedState: this.$root.$data,
				chosen_conversation_id: 0,
				enable_table_mode: false,
			};
		},
		watch: {
		    sharedState: {
	          deep: true,
	          handler: function(){
	          	if (this.$root.$data.chosen_conversation_id !== this.chosen_conversation_id){
	          		this.chosen_conversation_id = this.$root.$data.chosen_conversation_id;
	          		this.$root.$data.history = GLOBAL_OBJ.conversations.get(this.chosen_conversation_id);
	          	}
	          	if (this.$root.$data.enable_table_mode !== this.enable_table_mode){
	          		this.enable_table_mode = this.$root.$data.enable_table_mode;
	          	}
	          }
        	},
		},
		methods: {
			getImageUrl(senderId){
				let url = GLOBAL_OBJ.imageByGaiaIdMap.get(senderId);
				console.log(senderId);
				console.log(GLOBAL_OBJ.imageByGaiaIdMap);
				if (url){
					console.log(url);
					return url;
				}
				console.log('bruh');
				return '';
			}
		}
	});

	let testApp = new Vue({
	    el: '#app',
	    data: store.state
	  });

	console.log('Vue is live!');
	return testApp;
}

(function(document){
	let worker = new Worker();

	let vueInstance = createVueStuff(worker);

	/* these are for showing the sample dialog */ 
	var dialog = document.querySelector('#modal-example');
	var closeButton = dialog.querySelector('button');
	var showButton = document.querySelector('#show-modal-example');
	if (! dialog.showModal) {
	    dialogPolyfill.registerDialog(dialog);
	}
	var closeClickHandler = function(event) {
		if (event){
			dialog.close();	
		}	    
	};
	var showClickHandler = function(event) {
		if (event){
			dialog.showModal();
		}
	};
	showButton.addEventListener('click', showClickHandler);
	closeButton.addEventListener('click', closeClickHandler);
	/* ---------------------------------------------------*/

	let stream = createSelectImageStream('app-logo-container', vueInstance, GLOBAL_OBJ, worker);
	stream.subscribe(
		function(response){
			console.log(response);
		}
	);

	

})(document);