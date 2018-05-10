const oracledb = require('oracledb')
const { connectToDb, sqlRunner } = require('./util')
const moment = require('moment')

const announcement = require('./announcement')

const tableName = 'clubsim_inbox__user_data'

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

/**
 * Creates table for user_data
 * @returns {Object} a result object for execution of the cmd
 */
async function createTable() {
  const sqlCmd =
    `CREATE TABLE ${tableName}(
      id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
      club_id VARCHAR2(255),
      read_messages VARCHAR2(4000),
      deleted_messages VARCHAR2(4000)
    )`
  try {
    return await sqlRunner(sqlCmd)
  } catch (e) {
    console.error(`User createTable() Error: `)
    console.error(e)
    return { error: e }
  }
}

/**
 * Creates a new user and initialize the data
 * @param {String} clubId the ClubID
 * @returns {Object} a result object for execution of the cmd
 */
async function createNewUser(clubId) {
  const sqlCmd =
    `INSERT INTO ${tableName} (club_id, read_messages, deleted_messages)
    VALUES (:clubId, '[]', '[]')
    `
  try {
    return await sqlRunner(sqlCmd, {
      clubId
    })
  } catch (e) {
    console.error(`User createNewUser() Error: `)
    console.error(e)
    return { error: e }
  }
}

/**
 * Retrieve the data of a user and create one if not exists
 * @param {String} clubId the ClubID
 * @returns {Object} an object containing the user data
 */
async function retrieveUser(clubId) {
  const sqlCmd =
    `SELECT * FROM ${tableName}
    WHERE club_id = :clubId`

  try {
    // retrieve user data
    const result = await sqlRunner(sqlCmd, { clubId })
    if (result.rows.length > 0) {
      // assuming clubIds are unique, there should only be one entry
      let user = result.rows[0]
      user = {
        id: user[0],
        club_id: user[1],
        read_messages: JSON.parse(user[2]),
        deleted_messages: JSON.parse(user[3])
      }
      return user
    } else {
      // user doesn't exist in database, create a new user and try again
      await createNewUser(clubId)
      return await retrieveUser(clubId)
    }
  } catch (e) {
    console.error(`User retrieveUser() Error: `)
    console.error(e)
    return { error: e }
  }
}

/**
 * Retrieves the (undeleted) messages of a user
 * @param {String} clubId the ClubID
 * @returns {Object} a result object containing a list of messages
 */
async function retrieveUserMessages(clubId) {
  try {
    const announcements = await announcement.selectAllAnnouncements()
    const user = await retrieveUser(clubId)

    let result
    if (user.deleted_messages) {
      const payload = announcements.filter((item) => {
        return user.deleted_messages.indexOf(item.id) < 0
      })
      result = payload
    } else {
      result = announcements
    }

    if (user.read_messages) {
      result = result.map(item => {
        let isRead = false
        if (user.read_messages.indexOf(item.id) >= 0) {
          isRead = true
        }
        return {
          ...item,
          read: isRead
        }
      })
      console.log(user.read_messages)
      console.log(result)
    }
    return result
  } catch (e) {
    console.error(`User retrieveUserMessages() Error: `)
    console.error(e)
    return { error: e }
  }
}

async function userReadMessage(clubId, messageId) {
  try {
    // retrieve user's read_messages value
    const user = await retrieveUser(clubId)
    console.log(user)

    // append messageId to it
    const oldReadMessages = user.read_messages

    if (oldReadMessages.indexOf(messageId) >= 0) {
      return {
        status: 'Failure',
        message: `Message Doesn't Exist`
      }
    }

    oldReadMessages.push(messageId)
    const readMessages = JSON.stringify(oldReadMessages)

    // update the record
    const sqlCmd =
      `UPDATE ${tableName}
      SET read_messages = :readMessages
      WHERE club_id = :clubId
      `
    const result = await sqlRunner(sqlCmd, {
      readMessages,
      clubId
    })

    return {
      status: 'Success',
      result
    }
  } catch (e) {
    console.error(`User userReadMessage() Error: `)
    console.error(e)
    return { error: e }
  }
}

/**
 * Deletes a message from user's list of messages
 * @param {String} clubId the ClubID
 * @param {String} messageId the message ID of the message-to-be-deleted
 * @returns {Object} a result object for execution of the cmd
 */
async function userDeleteMessage(clubId, messageId) {

  try {
    // retrieve user's deleted_messages value
    const user = await retrieveUser(clubId)
    console.log(user)

    // append messageId to it
    const oldDeletedMessages = user.deleted_messages

    if (oldDeletedMessages.indexOf(messageId) >= 0) {
      return {
        status: 'Failure',
        message: `Message Doesn't Exist`
      }
    }

    oldDeletedMessages.push(messageId)
    const deletedMessages = JSON.stringify(oldDeletedMessages)

    // update the record
    const sqlCmd =
      `UPDATE ${tableName}
      SET deleted_messages = :deletedMessages
      WHERE club_id = :clubId
      `
    const result = await sqlRunner(sqlCmd, {
      deletedMessages,
      clubId
    })
    return {
      status: 'Success',
      result
    }
  } catch (e) {
    console.error(`User userDeleteMessage() Error: `)
    console.error(e)
    return { error: e }
  }
}

module.exports = {
  checkTableExists,
  createTable,
  createNewUser,
  userReadMessage,
  userDeleteMessage,
  retrieveUser,
  retrieveUserMessages
}
