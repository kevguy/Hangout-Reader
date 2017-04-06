/*jslint node: true */
/*jshint sub:true*/
'use strict';

// importScripts('https://cdnjs.cloudflare.com/ajax/libs/twemoji/1.2.1/twemoji.min.js');
// var twemoji = require('twemoji');

import { util } from './util';
import Rx from 'rxjs/Rx';
console.log(Rx);

let gaiaIdToImg = {};

function handleJsonFile(e){
	self.postMessage("see a file");

	var file = e.data.file;
	var reader = new FileReader();
	reader.readAsText(file, "UTF-8");

	console.log("started reading file");

	reader.onload = (function(worker){
		return function(evt){

			console.log("Loaded: " + evt.target.result.length);
			// observer.next(evt.target.result);
			console.log(util);
			let result = util.handleFile(evt.target.result);

			// createVueStuff(CONVERSATION_LIST, conversations);
			let conversation_list = result[0];
			let conversations = result[1];

			worker.postMessage({
				conversation_list,
				conversations
			});
		};
	})(self);

	reader.onerror = (function(worker){
		return function(err){
			worker.postMessage(err);
		};
	})(self);
}



/*
	fetch(path).then(function (response) {
	    response.body.getReader().read().then(function(result) {
	        return btoa(String.fromCharCode.apply(null, result.value));
	    }).then(function(b64) {
	        console.log(b64);
	    });
	});
*/

function createBase64Stream(url, gala_id){
	let stream = Rx.Observable.fromPromise(fetch(url))
					.flatMap(function(response){
						return Rx.Observable.fromPromise(response.body.getReader().read());
					})
					.flatMap(function(result){
						return Rx.Observable.fromPromise(btoa(String.fromCharCode.apply(null, result.value)));
					})
					.flatMap(function(result){
						gaiaIdToImg[gala_id] = result;
						return Rx.Observable.of(result);
					});
	return stream;
}


function createSingleFetchProfileImgStream(gala_id){
	let stream = Rx.Observable.fromPromise(
		fetch('https://www.googleapis.com/plus/v1/people/' + gala_id + 
						'?key=AIzaSyD6SrPQUrQlVpmbC3qGR8lXwNorOW_jqH4')
		)
		.flatMap(function(response){
			return Rx.Observable.fromPromise(response.json());
		})
		.flatMap(function(response){
			if (!response.error){
				console.log(response);
				console.log(response.image.url);
				console.log(response['displayName']);
				if (response.image){
					console.log('lets do this');
					gaiaIdToImg[gala_id] = response.image.url;
					return Rx.Observable.of({
						gala_id,
						response
					});
				}
			} else {
				// console.log(response);
				return createSingleFetchProfileImgStream(gala_id).delay(5000);
			}
			// console.log(GLOBAL_OBJ.imageByGaiaIdMap);				
		})
		.flatMap(function(result){
			return createBase64Stream(result.response.image.url, result.gala_id);
		});
		
	return stream;
}




function createFetchProfileImgsStream(name_list){
	let streams = [];
	name_list.map(function(name_id){
		if (name_id !== -1){
			let stream = createSingleFetchProfileImgStream(name_id);
			streams.push(stream);
		}
	});
	return Rx.Observable.merge(...streams);
}


function getProfileImgs(name_list){
	gaiaIdToImg = {};
	let stream = createFetchProfileImgsStream(name_list);
	stream.subscribe(function(response){
		console.log(response);
		self.postMessage({
			action: 'getProfileImgs',
			name_list: gaiaIdToImg
		});
	});
}




self.onmessage = function(e) {
	if (e.data.file && e.data.action === 'handleJsonFile'){
		handleJsonFile(e);
	}

	if (e.data.name_list && e.data.action === 'getProfileImgs'){
		getProfileImgs(e.data.name_list);
	}
};
