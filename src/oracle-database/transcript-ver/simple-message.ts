import { IConnection } from 'oracledb';
import { sqlRunner} from './utils';

const tableName = 'message_history';

export async function createTable() {
  const sqlCmd =
    `CREATE TABLE ${tableName}(
      message_id int NOT NULL AUTO_INCREMENT,
      club_id VARCHAR2(255),
      title VARCHAR2(255),
      body VARCHAR2(255),
      read NUMBER(1),
      deleted NUMBER(1),
      date_time DATE,
      PRIMARY KEY (message_id)
    )`;
  return await sqlRunner(sqlCmd);
}

export async function deleteTable() {
  const sqlCmd = `DROP TABLE ${tableName}`;
  return await sqlRunner(sqlCmd);
}

export async function findAllMessagesByUser(clubId: string) {
  const sqlCmd =
    `SELECT *
     FROM ${tableName}
     WHERE club_id = :clubId AND deleted = 0`;
  return await sqlRunner(sqlCmd, {});
}

export async function findReadMessagesByUser(clubId: string) {
  const sqlCmd =
    `SELECT *
     FROM ${tableName}
     WHERE club_id = :clubId AND read = 1 AND deleted = 0`;
  return await sqlRunner(sqlCmd, { clubId });
}

export async function findUnreadMessagesByUser(clubId: string) {
  const sqlCmd =
    `SELECT *
     FROM ${tableName}
     WHERE club_id = :clubId AND read = 0 AND deleted = 0`;
  return await sqlRunner(sqlCmd, { clubId });
}

export async function updateMessageReadStatus(messageId: string, read: boolean) {
  const sqlCmd =
    `UPDATE ${tableName}
    SET read = :read
    WHERE message_id = :messageId
    `;
  return await sqlRunner(sqlCmd, { messageId, read })
}

export async function deleteMessage(messageId: string) {
  const sqlCmd =
    `UPDATE ${tableName}
    SET deleted = 1
    WHERE message_id = :messageId
    `;
  return await sqlRunner(sqlCmd, { messageId })
}

// should insert time too?
export async function insertMessage(clubId: string, title: string, body: string) {
  const dummyDate = `2018-04-20 8:30:00`;
  const dateFormat = `YYYY-MM-DD hh24:mi:ss`;

  const sqlCmd =
    `INSERT INTO ${tableName} (club_id, title, body, read, deleted, date_time)
    VALUES (:clubId, :title, :body, 0, 0, TO_DATE(:dateTime, '${dateFormat}'))`;
  return await sqlRunner(sqlCmd, { clubId, title, body, dateTime: dummyDate });
}
