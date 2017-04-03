/*jslint node: true */
'use strict';



import {createSelectImageStream} from './selectFileStream';

var Vue = require('Vue');
var dialogPolyfill = require('dialogPolyfill');

// var document = typeof document === 'undefined' ? '' : document;

let GLOBAL_OBJ = {
	conversations: []
};

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
			};
		},
		watch: {
		    sharedState: {
	          deep: true,
	          handler: function(){
	          	console.log('handling');
	          	if (this.$root.$data.chosen_conversation_id !== this.chosen_conversation_id){
	          		console.log('oh shit');
	          		this.chosen_conversation_id = this.$root.$data.chosen_conversation_id;
	          		this.$root.$data.history = GLOBAL_OBJ.conversations.get(this.chosen_conversation_id);
	          	}
	          	if (this.$root.$data.enable_table_mode !== this.enable_table_mode){
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

console.log(document);
(function(document){
	let vueInstance = createVueStuff();
	console.log(document.querySelector);
	var dialog = document.querySelector('#modal-example');
	var closeButton = dialog.querySelector('button');
	var showButton = document.querySelector('#show-modal-example');
	if (! dialog.showModal) {
	    dialogPolyfill.registerDialog(dialog);
	}
	var closeClickHandler = function(event) {
		console.log(event);
	    dialog.close();
	};
	var showClickHandler = function(event) {
		console.log(event);
	    dialog.showModal();
	};
	showButton.addEventListener('click', showClickHandler);
	closeButton.addEventListener('click', closeClickHandler);

	let stream = createSelectImageStream('app-logo-container', vueInstance, GLOBAL_OBJ);
	stream.subscribe(function(response){
		console.log(response);
	});
})(document);