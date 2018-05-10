const oracledb = require('oracledb')
const { connectToDb, sqlRunner } = require('./util')
const moment = require('moment')

const tableName = 'clubsim_inbox__image_data';

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
    date_time DATE,
    file_name VARCHAR2(255),
    orignal_name VARCHAR2(255),
    PRIMARY KEY (id)
  )`;
  return await sqlRunner(sqlCmd);
}

async function saveImageMeta(fileName, originalName) {
  // await createTable()
  const date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
  const dateFormat = `YYYY-MM-DD hh24:mi:ss`;

  const sqlCmd =
    `INSERT INTO ${tableName} (date_time, file_name, orignal_name)
     VALUES (TO_DATE(:dateTime, '${dateFormat}'), :file_name, :original_name)
     RETURN file_name INTO :file_handle
    `;
  return await sqlRunner(sqlCmd, {
    file_handle: { type: oracledb.STRING, dir: oracledb.BIND_OUT},
    dateTime: date,
    file_name: fileName,
    original_name: originalName
  })
}

async function selectAll() {
  const sqlCmd =
    `SELECT * FROM ${tableName}
    `
  const result_p = await getRows(6)
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
  checkTableExists,
  createTable,
  saveImageMeta,
  selectAll,
  getRows
}
