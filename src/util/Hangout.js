'use strict'

import { Observable } from 'rxjs/Rx';


const BASE_URL = 'https://www.googleapis.com/plus/v1/people/';
const PUBLIC_API_ACCESS_KEY = 'AIzaSyD6SrPQUrQlVpmbC3qGR8lXwNorOW_jqH4';
const PLACEHOLDER_URL = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50';

/**
 * Creates a base64 image from given url
 * @param {String} url the url to the image
 * @returns {String} the base64 string
 */
export async function createBase64(url) {
  const response = await fetch(url);
  const result = await response.body.getReader().read();
  let resultStr = btoa(String.fromCharCode.apply(null, result.value));
  resultStr = `data:image/jpg;base64, ${resultStr}`;

  return resultStr;
}

/**
 * Retrieves and Observable that retrieves G+ Profile Images
 * @param {String | Number} gaiaId the gaiaId of the user
 * @returns {Observable} the Observable for fetching image info
 */
export function fetchProfileImgStream(gaiaId) {
  const stream = Observable
    .fromPromise(fetch(`${BASE_URL}${gaiaId}?key=${PUBLIC_API_ACCESS_KEY}`))
    .flatMap(response => Observable.fromPromise(response.json()))
    .flatMap((response) => {
      if (!response.error) {
        return Observable.of(response);
      } else if (response.error.message === 'Not Found') {
        return Observable.of('Not Found');
      }
      return fetchProfileImgStream(gaiaId).delay(3000);
    });

  return stream;
}

export async function fetchProfileImgLink(gaiaId, size) {
  const result = await fetchProfileImgStream(gaiaId).toPromise()
    .then((response) => {
      if (response !== 'Not Found') {
        return size === 'large' ?
          `${response.image.url}00`: // the 00 part is to increase size from 50 to 5000
          response.image.url ;
      }
      return size === 'large' ?
        `${PLACEHOLDER_URL}00`: // the 00 part is to increase size from 50 to 5000
        PLACEHOLDER_URL;
    });
  return result;
}

export function fetchProfileImgLinksStream(participants, size) {
  const arr = [];
  participants.forEach(participant => {
    arr.push(Observable
      .of(1)
      .delay(10)
      .flatMap((a) => Observable.fromPromise(fetchProfileImgLink(participant.gaiaId, 'large')))
      .map((result) => ({ gaiaId: participant.gaiaId, result, name: participant.name }))
    )
  })

  return Observable.concat(...arr);
}
