import { IConnection } from 'oracledb';
import { sqlRunner } from './utils';
import {isUndefined} from "util";

const tableName = 'unread_message_count';

/**
 * Create Table for unread_message_count
 * @returns {Promise} promise that contains result
 */
export async function createTable() {
  const sqlCmd =
    `CREATE TABLE ${tableName}(
      club_id VARCHAR2(255) PRIMARY KEY,
      count NUMBER
    )`;
  return await sqlRunner(sqlCmd);
}

export async function deleteTable() {
  const sqlCmd =
    `DROP TABLE ${tableName}`;
  return await sqlRunner(sqlCmd);
}

/**
 * Retrieve an user
 * @param {string} clubId the club id
 * @returns {Promise} promise that contains result
 */
export async function findUser(clubId: string) {
  const sqlCmd =
    `SELECT club_id, count
    FROM ${tableName}
    WHERE club_id = :clubId`;
  return await sqlRunner(sqlCmd, { clubId }, { maxRows: 1 });
}

/**
 * Find all the users
 * @returns {Promise} promise that contains result
 */
export async function findAll() {
  const sqlCmd = `SELECT club_id, count FROM ${tableName}`;
  return await sqlRunner(sqlCmd);
}

/**
 * Insert an new user (internal method)
 * @param {string} clubId the club id
 * @returns {Promise} promise that contains result
 */
export async function insertUser(clubId: string, count: number) {
  const sqlCmd =
    `INSERT INTO ${tableName} (club_id, count)
     VALUES (:clubIdVal, :countVal)`;
  return await sqlRunner(sqlCmd, {
    clubIdVal: clubId,
    countVal: count
  }, { autoCommit: true });
}

/**
 * Update the count value of an user (internal method)
 * @param {string} clubId the club id
 * @param {number} count the count value
 * @returns {Promise} promise that contains result
 */
export async function updateCount(clubId: string, count: number) {
  const sqlCmd =
    `UPDATE ${tableName}
    SET count = :count
    WHERE club_id = :clubId
    `;
  return await sqlRunner(sqlCmd, { count, clubId });
}

/**
 * Update the count value of an user
 * @param {string} clubId the club id
 * @param {number} count the count value
 * @returns {Promise} promise that contains result
 */
export async function updateUser(clubId: string, count: number) {
  // find user, if no results is found, create new user
  const queryResult = await findUser(clubId);
  if (queryResult.rows.length > 0) {
    // user is found, update count
    return await updateCount(clubId, count);
  }
  return await insertUser(clubId, count);
}

/**
 * Delete an user entry
 * @param {string} clubId the club id
 * @returns {Promise} promise that contains result
 */
export async function deleteUser(clubId: string) {
  const sqlCmd = `DELETE FROM ${tableName} WHERE club_id = :clubId`;
  return await sqlRunner(sqlCmd, { clubId });
}
