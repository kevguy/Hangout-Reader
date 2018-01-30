'user strict';

import { Observable } from 'rxjs/Rx';


const BASE_URL = 'https://www.googleapis.com/plus/v1/people/';
const PUBLIC_API_ACCESS_KEY = 'AIzaSyD6SrPQUrQlVpmbC3qGR8lXwNorOW_jqH4';

export async function createBase64(url) {
  const response = await fetch(url);
  const result = await response.body.getReader().read();
  let resultStr = btoa(String.fromCharCode.apply(null, result.value));
  resultStr = `data:image/jpg;base64, ${resultStr}`;

  return resultStr;
}

export default function fetchImgStream(gaiaId) {
  const stream = Observable
    .fromPromise(fetch(`${BASE_URL}${gaiaId}?key=${PUBLIC_API_ACCESS_KEY}`))
    .flatMap(response => Observable.fromPromise(response.json()))
    .flatMap((response) => {
      if (!response.error) {
        return Observable.of(response);
      } else if (response.error.message === 'Not Found') {
        return Observable.of('Not Found');
      }
      return fetchImgStream(gaiaId).delay(3000);
    });

  return stream;
}
