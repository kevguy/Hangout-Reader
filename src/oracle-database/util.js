const oracledb = require('oracledb');

function getConfig() {
  if (process.env.NODE_ENV === 'development') {
    return {
      user: process.env.ORACLE_DB_USER_DEV,
      password: process.env.ORACLE_DB_PASSWORD_DEV,
      connectString: process.env.ORACLE_DB_CONNECT_STRING_DEV
    }
  } else if (process.env.NODE_ENV === 'uat') {
    return {
      user: process.env.ORACLE_DB_USER_UAT,
      password: process.env.ORACLE_DB_PASSWORD_UAT,
      connectString: process.env.ORACLE_DB_CONNECT_STRING_UAT
    }
  } else if (process.env.NODE_ENV === 'production') {
    return {
      user: process.env.ORACLE_DB_USER_PROD,
      password: process.env.ORACLE_DB_PASSWORD_PROD,
      connectString: process.env.ORACLE_DB_CONNECT_STRING_PROD
    }
  } else {
    return {
      user: process.env.ORACLE_DB_USER_DEV,
      password: process.env.ORACLE_DB_PASSWORD_DEV,
      connectString: process.env.ORACLE_DB_CONNECT_STRING_DEV
    }
  }
}

async function testConnection() {
  try {
    const connection = await connectToDb()
    if (connection.hasOwnProperty('error')) return false
    return true
  } catch (e) {
    return false
  }
}

async function testCustomConnection(user, password, connectString) {
  try {
    oracledb.autoCommit = true;
    const connection = await oracledb.getConnection({
      user,
      password,
      connectString
    })
    console.log(connection)
    await releaseDb(connection)
    return true
  } catch (e) {
    return false
  }
}

/**
 * This function connects to the database
 * @returns {Object} an connection object or a object with an error message
 */
async function connectToDb() {
  try {
    oracledb.autoCommit = true;
    const { user, password, connectString } = getConfig()
    const connection = await oracledb.getConnection({
      user,
      password,
      connectString
    })
    return connection
  } catch (e) {
    console.error(`connectToDb() Error:`)
    console.error(e)
    return { error: e.message }
  }
}

/**
 * Releases the connection
 * @param {Object} connetion the connection object
 * @returns {NULL | Object} Null if success and an object if errors
 */
async function releaseDb(connection) {
  try {
    return await connection.close();
  } catch (e) {
    console.error(`releaseDb() Error:`)
    console.error(e)
    return { error: e.message }
  }
}

/**
 * A wrapper for connecting to the database and execute SQL commands
 * @returns { Object } a result object encapsulating the result of the cmd execution
 */
async function sqlRunner(sqlCmd, ...options) {
  const connection = await connectToDb()
  if (connection.hasOwnProperty('error')) return connection.error
  try {
    const result = await connection.execute(sqlCmd, ...options)
    return result
  } catch (e) {
    console.error(`sqlRunner() Error:`)
    console.error(e)
    // return {
    //   error: e
    // }
    throw e
  } finally {
    releaseDb(connection)
  }
}

module.exports = {
  testConnection,
  testCustomConnection,
  connectToDb,
  sqlRunner
}
