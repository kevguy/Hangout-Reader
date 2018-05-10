const oracledb = require('oracledb')
const { connectToDb, sqlRunner } = require('./util')
const moment = require('moment')

const tableName = 'clubsim_inbox__announce_data'

async function checkTableExists() {
  const sqlCmd =
    `SELECT * from ${tableName} where rownum = 1
    `
  try {
    const result = await sqlRunner(sqlCmd)
    return true
  } catch (e) {
    console.error(`User checkTableExists() error: `)
    console.error(e)
    console.log(Object.keys(e)) // errorNum, offset
    // { Error: ORA-00942: table or view does not exist errorNum: 942, offset: 14 }
    return false
  }
}

async function createTable() {
  const sqlCmd =
  `CREATE TABLE ${tableName}(
    id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    data_time DATE,
    title VARCHAR2(255),
    notification_body VARCHAR2(255),
    body VARCHAR2(4000),
    terms_and_conditions VARCHAR2(4000),
    message_type VARCHAR2(255),
    lang VARCHAR2(255),
    PRIMARY KEY (id)
  )
  `
  return await sqlRunner(sqlCmd)
}

async function saveAnnouncement(payload) {
  const date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
  const dateFormat = `YYYY-MM-DD hh24:mi:ss`;

  const { title, notification, body, toc, msgType, language } = payload

  const sqlCmd =
  `INSERT INTO ${tableName} (data_time, title, notification_body, body, terms_and_conditions, message_type, lang)
   VALUES (TO_DATE(:dateTime, '${dateFormat}'), :title, :notification_body, :body, :toc, :message_type, :lang)
   RETURN id INTO :id
  `

  try {
    console.log('trying to save data')
    const result = await sqlRunner(sqlCmd, {
      id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      dateTime: date,
      title,
      notification_body: notification,
      body,
      toc,
      message_type: msgType,
      lang: language
    })
    return result
  } catch (e) {
    console.log(e)
    console.log('trying to save data failed, creating table')
    // const result = await createTable()
    // //
    // console.log('trying to save data failed, created table')
    return {
      status: 'Failure',
      message: 'But created table'
    }
  }

}

async function selectAll() {
  const sqlCmd =
    `SELECT * FROM ${tableName}
    `
  // const result_p = await getRows(6)
  // console.log('page 1')
  // console.log(result_p)
  // console.log('page end')
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

async function selectAllAnnouncements() {
  const sqlCmd =
    `SELECT id, data_time, title, lang FROM ${tableName}
    `

  try {
    const result = await sqlRunner(sqlCmd)
    const payload = result.rows.map((item) => ({
      id: item[0],
      dateTime: item[1],
      title: item[2],
      lang: item[3],
      is_announcement: true
    }))
    return payload
  } catch (e) {
    console.error(e)
    const result = await createTable()
    return await selectAllAnnouncement()
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


async function getMessage(messageId) {
  const sqlCmd =
    `SELECT * FROM ${tableName}
    WHERE ID = :messageId
    `
  try {
    console.log('trying to query data')
    const result = await sqlRunner(sqlCmd, {
      messageId,
    })
    console.log(result)
    return result
  } catch (e) {
    console.log(e)
    console.log('trying to save data failed, creating table')
    // const result = await createTable()
    // //
    // console.log('trying to save data failed, created table')
    return {
      status: 'Failure',
      message: 'But created table'
    }
  }
}

module.exports = {
  checkTableExists,
  createTable,
  saveAnnouncement,
  selectAll,
  selectAllAnnouncements,
  getRows,
  getMessage
}
