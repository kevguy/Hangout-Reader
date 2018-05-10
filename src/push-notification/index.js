const { getAccessTokenPromise } = require('./utils');
const HttpsProxyAgent = require('https-proxy-agent');

// https://firebase.google.com/docs/cloud-messaging/js/topic-messaging

async function sendMsgToAndTopics(title, msg, topics) {
  const url = `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`;
  const condition = topics
    .reduce((acc, topic) => `&& '${topic}' in topics ` + acc, '')
    .substr(3)
  console.info(condition)

  try {
    const accessToken = await getAccessTokenPromise()
    console.log('grabbed accessToken from Google!')
    console.log(accessToken)

    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }),
      body: JSON.stringify({
        "message":{
          "condition": condition,
          "notification" : {
            title,
            body: msg
          },
          "apns": {
            "headers": {
              "alg": "HS256",
              "typ": "JWT",
              "kid": "“5ACRKF34B6"
            },
            "payload": {
              "aps" : {
                "alert" : {
                  "title" : "Introduction To Notification",
                  "subtitle" : "Session 707",
                  "body" : "New Notification Look Amazing"
                },
                "sound" : "default",
                "category" : "message",
                "badge" : 1,
                "mutable-content": 1,
                "content-available": 1
              },
              "attachment-url": "https://pusher.com/static_logos/320x320.png"
            }
          }
          // apns: {
          //   header: {
          //     'apns-priority': '10'
          //   },
          //   payload: {
          //     aps: {
          //       alert: {
          //         title: '$GOOG up 1.43% on the day',
          //         body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
          //       },
          //       badge: 42,
          //     }
          //   }
          // },
          // apns: {
          //   headers: {
          //
          //   },
          //   payload: {
          //     "content-available": 1
          //   }
          // }
        },
      })
    }

    console.log(options)

    if (process.env.NODE_ENV === 'uat') {
      options.agent = new HttpsProxyAgent(process.env.UAT_PROXY);
    } else if (process.env.NODE_ENV === 'production') {
      options.agent = new HttpsProxyAgent(process.env.PRODUCTION_PROXY);
    }

    const result = await fetch(url, options)
      .then(res => res.json())
      .catch(e => { throw e; })
    console.log(options)
    console.log('message seems to be sent')
    console.log(options)
    console.log(JSON.stringify(result))
    return result
  } catch (e) {
    console.error(e)
  }
}

async function sendSampleMessage() {
  let result = await sendMsgToAndTopics('Sample Title', 'Sample message', [
    'ACCEPT_PUSH',
    'CHINESE',
    '8096399897'
  ])
  console.log(result)
  result = await sendMsgToAndTopics('Sample Title', 'Sample message', [
    'ACCEPT_PUSH',
    'ENGLISH',
    '8096399897'
  ])
  console.log(result)
  return result
}

module.exports = {
  sendMsgToAndTopics,
  sendSampleMessage
}
