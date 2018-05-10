import { IConnection } from 'oracledb';
import { sqlRunner } from './utils';

const tableName = 'message';

export async function createTable() {
  const sqlCmd =
    `CREATE TABLE ${tableName}(
      message_id int NOT NULL AUTO_INCREMENT,
      club_id VARCHAR2(255),
      read NUMBER(1),
      deleted NUMBER(1),
      date_time DATE,
      notification VARCHAR2(255),
      payload VARCHAR2(255),
      PRIMARY KEY (message_id)
    )
    `;
  return await sqlRunner(sqlCmd);
}
