import * as oracledb from 'oracledb';
import { IConnection } from 'oracledb';

// oracledb.autoCommit = true;

export async function connectToDb(): Promise<IConnection | { error: any }> {
  try {
    const connection = await oracledb.getConnection({
      user: 'system',
      password: 'oracle',
      connectString: 'localhost:1521/xe'
    });
    return connection;
  } catch (e) {
    return {
      error: e.message
    };
  }
}

export async function sqlRunner(sqlCmd: string, ...options: any[]) {
  const connection = await connectToDb();
  if (connection.hasOwnProperty('error')) return (<any>connection).error;
  return await (<IConnection>connection).execute(sqlCmd, ...options);
}
