// import * as fs from 'fs'
// import * as stream from 'stream'
const image = require('../oracle-database/image')

const fs = require('fs')
const stream = require('stream')

const crypto = require('crypto')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: './images',
  filename(req, file, cb) {
    // cb(null, `${new Date()}-${file.originalname}`)
    cb(null, hashFileName(file.originalname))
  }
})
const upload = multer({ storage })

function hashFileName(originalFileName) {
  return crypto
    .createHash('md5')
    .update(`${new Date()}-${originalFileName}`)
    .digest('hex') + `.${originalFileName.split('.').pop()}`
}

function uploadImage() {
  console.log('I just want to upload image man')
}

function retrieveFile() {

}

const dirPath = `${process.env.PWD}/images`;


const { Observable }  = require('rxjs/Rx')

function listFiles() {
  const observable = Observable.create((observer) => {
      fs.readdir(dirPath, (err, items) => {
        // items = items.map((item: string) => (item.replace('.csv', '')));
        observer.next(items);
        observer.complete();
      });
    });
    return observable.toPromise();
}

function downloadFiles(req, res, next, fileName) {
  // console.log(`${dirPath}/${fileName}`)
  res.download(`${dirPath}/${fileName}`);
}

function imageRoutes(app) {
  
   /**
    * Check if User table exists, true if yes, false if not
    */
   app.get('/api/image/check', async (req, res, next) => {
     let result
     try {
       result = await image.checkTableExists()
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
   app.get('/api/image/create-table', async (req, res, next) => {
     let result
     try {
       result = await image.createTable()
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


  app.post('/api/image/upload', upload.single('file'), async (req, res, next) => {
    const fileName = req.file.filename
    const savedFilePath = req.file.path
    let fileHandle = ''
    try {
      const result = await image.saveImageMeta(
        req.file.filename, // the hashed file name
        req.file.originalname
      )
      // console.log(req.file.filename)
      console.log(result)
      fileHandle = result.outBinds.file_handle[0]
    } catch (e) {
      console.log(e)
    }
    res.send(JSON.stringify({
      status: 'Success',
      message: `Image Uploaded, handle is ${fileHandle}`,
      fileHandle
    }))
  })

  app.get('/api/image/list-all', async (req, res, next) => {
    try {
      const result = await image.selectAll()
      const response = result.rows.map(item => ({
        timestamp: item[1],
        hashedName: item[2],
        originalName: item[3]
      }))
      res.send(JSON.stringify(response))
    } catch (e) {
      res.send(JSON.stringify(e))
    }
  })

  app.get('/api/image/:name', (req, res, next) => {
    // console.log(req.params.name)
    downloadFiles(req, res, next, req.params.name)
  })
}

module.exports = {
  imageRoutes
}
