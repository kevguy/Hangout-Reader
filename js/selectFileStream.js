/*jslint node: true */
'use strict';

var Worker = require("worker!./uploadfile-worker");
var Rx = require("Rx");

let createSelectImageStream = function createSelectImageStream(elementId, vueInstance, GLOBAL_OBJ){
	
	var worker = new Worker();

	var container = '#' + elementId;

	var appLogoInputElement = document.querySelector(container + ' input[type="file"].kev-inputFile');
	var appLogoInputFileNameElement = document.querySelector(container + ' input[type="text"].kev-inputFileName');
	var dropbox = document.querySelector(container + ' div.kev-dropzone');
	var previewElement = document.querySelector(container + ' .kev-img-container > img.kev-preview');
	var uploadBtn = document.querySelector(container + ' .kev-inputFile-btn');


	function handleFile(data){
		vueInstance.conversation_list = data.conversation_list;
		GLOBAL_OBJ.conversations = data.conversations;

		let el = document.querySelector('.upload-status');
		el.classList.remove('upload-complete-not-visible');

		el = document.querySelector('.upload-progress-bar');
		el.classList.add('progress-bar-not-visible');

		el = document.querySelector('.upload-dialog');
		el.classList.add('upload-not-visible');

		let snackbar = document.querySelector('#load-complete');
		let snackbarData = {
	      message: 'JSON loaded',
	      timeout: 5000,
	      actionHandler: function(event){
	      	if (event){
	      		snackbar.classList.remove('mdl-snackbar--active');	
	      	}
	      },
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

				worker.postMessage({file});

				return Rx.Observable.create(function(observer){
					worker.onmessage = function(e){
						if (e.data.conversation_list){
							observer.next({data: e.data});
						}	
					};
				});
			} else {
				return Rx.Observable.just(0);
			}
		} 
		return Rx.Observable.just(0);
	}

	let uploadBtnStream = Rx.Observable.create(function(o){
			uploadBtn.addEventListener('click', function(e){
				o.next({event: e, context: this, action:'click'});
			}, false);
		})
		.do(function(response){
			console.log(response);
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

	// let intervalStream = Rx.Observable
	// 					    .interval(2000 /* ms */)
	// 					    .timeInterval();

	let selectImageStream = Rx.Observable.merge(uploadBtnStream,
										uploadStream, 
										dragenterStream,
										dragleaveStream,
										dragoverStream, 
										dropStream);
										//cancelStream);

	return selectImageStream;
};


export {createSelectImageStream};