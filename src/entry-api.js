// import formidable from 'formidable';
const express = require('express')

const uploadImage = require('./api/upload-image')
const saveAnnouncement = require('./api/save-announcement')
const user = require('./api/user')
const notification = require('./api/notification')

const { testConnection, testCustomConnection } = require('./oracle-database/util')

const fetch = require('isomorphic-fetch')

const app = express.Router()

uploadImage.imageRoutes(app)
saveAnnouncement.messageRoutes(app)
user.userRoutes(app)
notification.notificationRoutes(app)

app.get('/api/environment', (req, res, next) => {
  res.send(JSON.stringify({
    status: 'Success',
    message: process.env.NODE_ENV
  }))
})

app.get('/api/test-db-connection', async (req, res, next) => {
  const result = await testConnection()
  res.send(JSON.stringify({
    status: 'Success',
    message: result
  }))
})

app.post('/api/test-custom-db-connection', async (req, res, next) => {
  try {
    const { user, password, connectString } = req.body
    console.log(req.body)
    const result = await testCustomConnection(user, password, connectString)
    console.log(result)
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

app.get('/hihihi', async (req, res, next) => {
  console.log(imageRoutes)
  // console.log(await fetch('https://www.google.com'))
  console.log('hihihi')
  res.send(JSON.stringify({ status: 'hmr byebye tdsvsdvsdvest success' }));
});
app.get('/byebye', (req, res, next) => {
  res.send(JSON.stringify({ status: 'hmr byebye tdsvsdvsdvest success' }));
});



// app.post('/upload-image', (req, res, next) => {
//   const form = new formidable.IncomingForm();
//   form.parse(req, function(err, fields, files) {
//
//   });
// });

module.exports = app;
