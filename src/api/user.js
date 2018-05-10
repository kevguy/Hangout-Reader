const user = require('../oracle-database/user')




function userRoutes(app) {

  app.get('/api/icon-badge/:lang/:clubId', async (req, res, next) => {
    console.log(req.params)
    if (req.params.lang !== 'EN-US' && req.params.lang !== 'ZH-HK') {
      next()
      return
    }
    console.log('shit')
    console.log('hihi')
    let result = await user.retrieveUserMessages(req.params.clubId)
     // .filter((item) => item.lang === req.params.lang)
    console.log(result)
    result = result.filter((item) => item.lang === req.params.lang)

    res.send(JSON.stringify({
      no_of_messages: result.length
    }))
  })

  /**
   * Check if User table exists, true if yes, false if not
   */
  app.get('/api/users/check', async (req, res, next) => {
    let result
    try {
      result = await user.checkTableExists()
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
  app.get('/api/users/create-table', async (req, res, next) => {
    let result
    try {
      result = await user.createTable()
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

  app.post('/api/users/delete', async (req, res, next) => {
    console.log('deleting')
    console.log(req.body)

    if (!req.body.messageId || !req.body.messageId) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: 'Invalid Request, keys missing'
      }))
      return
    }

    try {
      const { messageId, clubId } = req.body
      console.log(req.body)
      const result = await user.userDeleteMessage(clubId, messageId)

      if (result.status === 'Success') {
        res.send(JSON.stringify({
          status: 'Success',
          message: 'Message Deleted'
        }))
      } else {
        res.send(JSON.stringify(result))
      }
    } catch (e) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: JSON.stringify(e)
      }))
    }
  })

  app.post('/api/users/read', async (req, res, next) => {
    console.log('reading')
    console.log(req.body)

    if (!req.body.messageId || !req.body.messageId) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: 'Invalid Request, keys missing'
      }))
      return
    }

    try {
      const { messageId, clubId } = req.body
      console.log(req.body)
      const result = await user.userReadMessage(clubId, messageId)

      if (result.status === 'Success') {
        res.send(JSON.stringify({
          status: 'Success',
          message: 'Message Read'
        }))
      } else {
        res.send(JSON.stringify(result))
      }
    } catch (e) {
      res.send(JSON.stringify({
        status: 'Failure',
        message: JSON.stringify(e)
      }))
    }
  })


  /**
   *
   */

   app.get('/api/users/:lang/:clubId', async (req, res, next) => {
     console.log(req.params)
     if (req.params.lang !== 'EN-US' && req.params.lang !== 'ZH-HK') {
       next()
       return
     }
     console.log('hihi')
     let result = await user.retrieveUserMessages(req.params.clubId)
      // .filter((item) => item.lang === req.params.lang)
     console.log(result)
     result = result.filter((item) => item.lang === req.params.lang)

     res.send(JSON.stringify(result))
   })


  app.get('/api/users/:clubId', async (req, res, next) => {
    const result = await user.retrieveUserMessages(req.params.clubId)
    res.send(JSON.stringify(result))
  })




}


module.exports = {
  userRoutes
}
