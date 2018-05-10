const { sendMsgToAndTopics, sendSampleMessage } = require('../push-notification')
const announcement = require('../oracle-database/announcement')

async function saveAnnouncement(payload) {

  // TODO: save content into database
  console.log('executing announcement.saveAnnouncement')
  const result = await announcement.saveAnnouncement(payload)
  const recordId = result.outBinds.id[0]
  /**
   * should look something like this:
     { outBinds: { id: [ '5' ] },
    rowsAffected: 1,
    rows: undefined,
    metaData: undefined }
   */

  // TODO: send the push notification
  const { title, notification, language } = payload
  let langPref = ''
  if (language === 'ZH-HK') {
    langPref = 'CHINESE'
  } else if (language === 'EN-US') {
    langPref = 'ENGLISH'
  }
  const sendResult = await sendMsgToAndTopics(title, notification, [
    'ACCEPT_PUSH',
    langPref,
    '8096399897'
  ])


  // probably TODO: notify Kafka about it

  return recordId
}

async function saveSampleAnnouncement() {
  const sampleData = {
    title: 'Sample Title',
    notification: 'Sample Notification Body',
    body: JSON.stringify([
      { type: 'image', imageId: 'ff779adf35c41db8fce9a4219275fd7f.png' },
      { type: 'text', content: 'Sample Text Body' }
    ]),
    toc: '',
    msgType: 'Promotion',
    language: 'EN-US'
  }

  // TODO: save content into database
  console.log('executing announcement.saveAnnouncement')
  const result = await announcement.saveAnnouncement(sampleData)
  const recordId = result.outBinds.id[0]
  /**
   * should look something like this:
     { outBinds: { id: [ '5' ] },
    rowsAffected: 1,
    rows: undefined,
    metaData: undefined }
   */

  // TODO: send the push notification

  // probably TODO: notify Kafka about it

  return recordId
}



function messageRoutes(app) {

  /**
   * Check if User table exists, true if yes, false if not
   */
  app.get('/api/announcement/check', async (req, res, next) => {
    let result
    try {
      result = await announcement.checkTableExists()
      res.send(JSON.stringify({
        status: 'Success',
        message: result
      }))
    } catch (e) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: result
      }))
    }
  })

  /**
   * Create User Table
   */
  app.get('/api/announcement/create-table', async (req, res, next) => {
    let result
    try {
      result = await announcement.createTable()
      res.send(JSON.stringify({
        status: 'Success',
        message: result
      }))
    } catch (e) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: result
      }))
    }
  })

  /**
   * Send inbox message
   */
   app.get('/api/announcement/send-sample', async (req, res, next) => {
     const result = await saveSampleAnnouncement()
     res.send(JSON.stringify({
       status: 'Success',
       message: `Record Inserted, with ID ${result}`
     }))
   })

   app.get('/api/announcement/list-all', async (req, res, next) => {
     try {
       const result = await announcement.selectAll()
       // console.log(result)
       const response = result.rows;
       console.log(response)
       const payload = response.map(item => ({
         id: item[0],
         dateTime: item[1],
         title: item[2],
         notification: item[3],
         body: JSON.parse(item[4]),
         toc: item[5],
         type: item[6],
         lang: item[7]
       }))
       console.log(payload)
       res.send(JSON.stringify(payload))
     } catch (e) {
       res.send(JSON.stringify(e))
     }
   })

  app.post('/api/announcement/send', async (req, res, next) => {
    const result = await saveAnnouncement(req.body)
    console.log(req.body)
    res.send(JSON.stringify({
      status: 'Success',
      message: `Record Inserted, with ID ${result}`
    }))
  })

  app.get('/api/announcement/:id', async (req, res, next) => {
    // TODO: retrieve corresponding message
    try {
      const result = await announcement.getMessage(req.params.id)
      const response = result.rows;
      if (response.length > 0) {
        const payload = {
          id: response[0][0],
          dateTime: response[0][1],
          title: response[0][2],
          notification: response[0][3],
          body: JSON.parse(response[0][4]),
          toc: response[0][5],
          type: response[0][6],
          lang: response[0][7]
        }
        res.send(JSON.stringify(payload))
      } else {
        res.send(JSON.stringify({}))
      }
    } catch (e) {
      res.send(JSON.stringify(e))
    }
  })
}

module.exports = {
  messageRoutes
}
