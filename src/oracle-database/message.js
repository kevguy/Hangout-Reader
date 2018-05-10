const { ocnnectToDb, sqlRunner } = require('./util')
const moment = require('moment')

const tableName = 'message_data'

async function createTable() {
  const sqlCmd =
  `CREATE TABLE ${tableName}(
    id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    data_time DATE,
    title VARCHAR2(255),
    notification_body VARCHAR2(255),
    body VARCHAR2(4000),
    message_type VARCHAR2(255),
    lang VARCHAR2(255),
    PRIMARY KEY (id)
  )
  `
  return await sqlRunner(sqlCmd)
}

async function saveMessage(payload) {
  const date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  const dateFormat = `YYYY-MM-DD hh24:mi:ss`

  const { title, notification, body, msgType, language } = payload

  const sqlCmd =
  `INSERT INTO ${tableName} (date_time, title, notification_body, body, message_type, lang)
   VALUES (TO_DATE(:dateTime, '${dateFormat}'), :title, :notification_body, :body, :message_type, :lang)
  `

  return await sqlRunner(sqlCmd, {
    dateTime: date,
    title,
    notification_body: notification,
    body,
    message_type: msgType,
    lang: language
  })
}

async function selectAll() {
  const sqlCmd =
    `SELECT * FROM ${tableName}
    `
  const result_p = await getRows(6)
  console.log('page 1')
  console.log(result_p)
  console.log('page end')
  try {
    console.log('selecting all here')
    const result = await sqlRunner(sqlCmd)
    return result
  } catch (e) {
    console.error(e)
    // { Error: ORA-00942: table or view does not exist errorNum: 942, offset: 14 }
    // if (e.indexOf('table or view does not exist') > 0) {
      // console.log('creating table')
      const result = await createTable()
      return await selectAll()
    // }
  }
}

const pageSize = 2
async function getRows(pageNo) {
  const sqlCmd =
    `SELECT * FROM
    (
      SELECT a.*, rownum r__
      FROM
      (
        SELECT * FROM ${tableName}
      ) a
      WHERE rownum < ((${pageNo} * ${pageSize}) + 1)
    )
    WHERE r__ >= (((${pageNo}-1) * ${pageSize}) + 1)
    `
    return await sqlRunner(sqlCmd)
}

module.exports = {
  saveMessage,
  selectAll,
  getRows
}
