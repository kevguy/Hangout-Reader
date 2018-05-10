const { sendMsgToAndTopics, sendSampleMessage } = require('../push-notification')

function notificationRoutes(app) {
  /**
   * Send a push notification
   */
  app.post('/api/notification/send', async (req, res, next) => {
    try {
      const { clubId, title, notification, lang } = req.body
      console.log(req.body)
      let langPref = ''
      if (lang === 'ZH-HK') {
        langPref = 'CHINESE'
      } else if (lang === 'EN-US') {
        langPref = 'ENGLISH'
      }
      const result = await sendMsgToAndTopics(title, notification, [
        'ACCEPT_PUSH',
        langPref,
        clubId
      ])
      res.send(JSON.stringify({
        status: 'Success',
        message: result
      }))
    } catch (e) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: e
      }))
    }
  })
}

module.exports = {
  notificationRoutes
}
