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






























var worker = new Worker('fileupload.js');

// worker.onmessage = function(e) {
// 	console.log('from web worker');
// 	console.log(e.data);
// }

// worker.postMessage({
// 	msg: 'fuck'
// });




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
		vueInstance.conversation_list = data.conversation_list;
		GLOBAL_conversations = data.conversations;

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


				worker.postMessage({
					file: file
				});

				return Rx.Observable.create(function(observer){
					worker.onmessage = function(e){
						if (e.data.conversation_list){
							observer.next({data: e.data});
						}	
					}
					// var reader = new FileReader();
					// reader.readAsText(file, "UTF-8");

					// reader.onload = function(evt){
					// 	console.log("Loaded: " + evt.target.result.length);
					// 	observer.next(evt.target.result);
					// }

					// reader.onerror = function(err){
					// 	observer.error(err);
					// 	alert("Error ");
					// }
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
				handleFile(response.data);
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
			handleFile(response.data);
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