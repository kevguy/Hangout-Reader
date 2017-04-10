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
	fetch(path)
		.then(function (response) {
		    response.body.getReader().read()
		    .then(function(result) {
		        return btoa(String.fromCharCode.apply(null, result.value));
		    })
		    .then(function(b64) {
		        console.log(b64);
		    });
		});
*/

/*
function createBase64Stream_fake(url, gala_id){
	let stream = Rx.Observable.of("iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAA3NCSVQICAjb4U/gAAAAYFBMVEUxbd57nvdahueUtv9KeeeEqvdjku9Cdeelw/9CceeMsvdCcd5jju9Sgudzmu85cd57pvdaiu+cvv9KfeeErvdrlu+ly/85bd5aiueUuv9rku+lx/+Msv+EpvdSfeeMrvf2iXAnAAACTklEQVRIiZVUgY6kIAztTVxD6LqdE4/R9P//86AFKTiTrIDjBFte32spuNsDeL03k4u76cMr1D+/XStD/fP7eZdLIiNc7oR1H2XlhHKDi74+KMYcY8yvMS4TWHda3P4GgOl743df4bKz8jERESIRhCOar7pMwdQVNyCcZCLBdsWBTr88PVA2Tz/ZCXz/tealUyWFhFPCoSm7ErKJQRUbw/oRjLxQkOjPqPKYlygAssSTMMQhskv2QWlgEJC04OgCySh9tjxJUIHESRidAhjF7PSkNMQhP/jaorEXxfpI/SudHBRFkBTlkn0bKSlIQ4HBoGTfKPbQ83XlZ482LEXpVfcQyvH6oiH9a0M5YXZSa42M9ui6Kuuyr3XqXCC1zw4Y3GBwzX72Wl6oTJAejl3PxCh27jjHX/mypAefcagNvnCp+9H/pOFjdI2IzQuPJ7nV6e13brB+l5f6SsbCYowqz0v2c1ipOv325f3Bpcu87TB1h3mbFwB6pUmpy8zPIw5Y/d2PfgciNCP5Lc9okc6eLFvHIvaTmXqfNyu2zcsXEZ52dUi3gTlyF5iCxqf2LyoXRh/tNghzI9B68gpYOpGlIk751rTYTsXiP+krWsQVplybjL33eRGXHaWD5fIdhnacCwrzdwHB0OOUTrO0VDYUkSvUGznChNpnWudPgWV8ue/t/JPRtJwlV/PieFaB3oCodGxbn6ZlL1msBweylHBpqawo2iboA8hnLsEKZiRL+w/lYhRLKBN+gKGOS48i9oaF5fK4cuG5VEt/elPs5PIfdaS3gcUOUPIAAAAASUVORK5CYII=")
						.flatMap(function(resultStr){
							gaiaIdToImg[gala_id] = "data:image/jpg;base64, " + resultStr;
							return Rx.Observable.of(resultStr);
						});
	return stream;
}
*/


function createBase64Stream(url, gala_id){
	let stream = Rx.Observable.fromPromise(fetch(url))
					.flatMap(function(response){
						return Rx.Observable.fromPromise(response.body.getReader().read())
									.flatMap(function(result){
										let resultStr = btoa(String.fromCharCode.apply(null, result.value));
										gaiaIdToImg[gala_id] = "data:image/jpg;base64, " + resultStr;
										return Rx.Observable.of(resultStr);
									});
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
