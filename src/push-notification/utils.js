const Firebase = require('firebase/app')

const {google} = require('googleapis');

const axios = require('axios-https-proxy-fix');
const querystring = require('querystring');
const jws = require('jws');

function getConfig() {
  return {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_DOMAIN_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };
}

function getServiceAccountInfo() {
  return {
    type: 'service_account',
    project_id: 'clubsim-d63ed',
    private_key_id: '45afb1a1967bc414743a384569117d9949cf45b6',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoLAC4Q1lBnTER\nGQmOj0duz8vqOJWtT0V/vr/pDCXVZ/swdwstwPrUjlXn9LFrzyP484cJwjEb4xRy\n0Eqa6RENA7W8Xkffy1UCRBFjkrtXiQV3Ac12G7KFhgb3B7Na7peeiaKNaLwl5BtM\n/TUzXZj55ry1wRbg0rI8czWR6TWIeoBq0s6E/vsGbaUf0pHpXRuS+llZGgpQS+/D\nqcnjWpXVUEmfhOEssjka4ML7rNEhKpbXFf4yLiK6T0WnokluFM+CjE5nNJ5SxQHW\nnvuglhYSzQEch0MRf0etBD9/mgLksOiGU0LmFvmYI48IqhyXN9CqfIrUp8/2R8da\nopXoQceDAgMBAAECggEAFkC8V6WRyfzi4UBO425SJXeZpASYybYTnDPBcTUKTJLV\nyjP2ZreCeV3cQDVAxOND/006MTBhDy+dJRQqyxTMDMzQ33waRqLBPOuE4YgpAgw/\njN/QMDC6DrENeuKp+P5ZUcEkoVGak+j7M9TNlV5tP6QolGRYgqdermEQVZ5mVwin\ntYFViFa36GjuvwjtwjF/BDoC4wsRFJ38uP+9vACM3sBKFUfQHBCCPlajCutBM7L6\nqsYwSBcXi7IN89S3sKcWkq05fLGSDeXAvPAJfvriv24BPTR2/2zUJa84g3ka51lu\nITbRbwK+SQ4DGDBmGuW2JwvhDN9x8qjpMkIS4zYOAQKBgQDbk/qe8Y5i+Kl4HIao\n387lC/M8IKtVgMDXkJBQc9wYMSr6sR6Oc9Z8EZeKMbnB+yZxFb/e90eZc+H/Ollr\n3jGS/epje0TKQA/u21MNxIaGPbmK3ksx3WbZ6Uz3/R2PCdix3aXRx31PybGh5Kz9\n7mslbr2zGRKzmDfsePf9D+DgqQKBgQDEESVSPg9JrHFOyPlZH03w7UF48DooETlX\nwdiRLWtV/I3nU+S/PgkhrOupJ/4JgvDUlOmiHWYTHJQxeIqmnSYX3F9u4TghjM8X\noB1zjnhd7wgbOdC5tWZBw53Ttev4F6WDVWb8wW3RIifikP4dYZoZYXizGvo5HfpA\nGgM+ALwGSwKBgAdcZZlwdZqBxYSeSDFfF1t8VBIe8j9yioRvdzcLO0SgWVWAHIsf\n/P+5wz/BvP1wwvAlj4IU/hR52wioVxkToMvRsUrWdg7lqOMT/SvH+86CQTcTjqfE\nSU9iz868cII8DUShLo7ixiOnmknYFaiJlpPxq3BWldbpcm59+6pDHwHJAoGAOuN7\ndiw1o0cr8SHj4qTIYCiilZRxoz8pHfaW+WPO7VChvm0wM1CKpZauYWwlnO27L95a\nHdr+oZbf28v8uPZSTrBd6YuztD/6o3nv3plYBb6ZjLPcwSp+wBnk+YWWjjlr+PpZ\nqGjgdwPvPtmVuXVrN1xTSFg995HNbBtkBedqkekCgYEAnqxh7GaJw8jPjNPeGMIL\nVbM7qa1PDUC/s0kFw6n92dwRVlcgDVF/G7zDOWCIfOVcUSzAoXJh4Yrsz9tnCQIv\neNCMhyx4y0+r1bIhyTa+PkbQzBHr2RH1jQAG6kLahkbgBxy/pD0+hRagXcM4/o/W\nwnR40aeZdfg/WpVeNyrJG/g=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-8l3py@clubsim-d63ed.iam.gserviceaccount.com',
    client_id: '104380491270972659600',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8l3py%40clubsim-d63ed.iam.gserviceaccount.com'
  };
}

// https://firebase.google.com/docs/cloud-messaging/auth-server
const SCOPES = 'https://www.googleapis.com/auth/firebase.messaging';

const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_REVOKE_TOKEN_URL =
    'https://accounts.google.com/o/oauth2/revoke?token=';

function requestToken(client_email, private_key, proxy) {
  const iat = Math.floor(new Date().getTime() / 1000);
  const additionalClaims = {};
  const payload = Object.assign(
    {
      iss: client_email,
      scope: SCOPES,
      aud: GOOGLE_TOKEN_URL,
      exp: iat + 3600,
      iat,
      sub: undefined
    },
    additionalClaims);
  const signedJWT =
    jws.sign({header: {alg: 'RS256'}, payload, secret: private_key});
  return axios({
    method: 'post',
    url: GOOGLE_TOKEN_URL,
    data: querystring.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJWT
    }),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    proxy
  })
  .then(r => {
    const body = r.data;
    console.log(body);
    return body.access_token;
  })
  .catch(e => {
    const body = (e.response && e.response.data) ? e.response.data : {};
    let err = e;
    if (body.error) {
      const desc =
          body.error_description ? `: ${body.error_description}` : '';
      err = new Error(`${body.error}${desc}`);
    }
    throw err;
  });
}

function uatGetAccessTokenPromise() {
  const proxy = {
    host: process.env.UAT_PROXY_HOST,
    port: process.env.UAT_PROXY_PORT,
    auth: {
      username: '',
      password: '',
    }
  };

  const key = getServiceAccountInfo();
  return requestToken(key.client_email, key.private_key, proxy);
}


function getAccessTokenPromise() {
  if (process.env.NODE_ENV === 'uat') {
    console.log('getting uat access token promise')
    return uatGetAccessTokenPromise()
  }

  return new Promise((resolve, reject) => {
    const key = getServiceAccountInfo()

    const jwtClient = new google.auth.JWT(
      key.client_email,
      undefined, // null,
      key.private_key,
      SCOPES,
      undefined, // null
    )

    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('fuck');
      console.log(tokens);
      resolve(tokens.access_token);
    });
  })
}

module.exports = {
  getAccessTokenPromise
}
