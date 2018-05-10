import { IConnection } from 'oracledb';
import { sqlRunner } from './utils';

/*
_id:Long,
clubId: Long,
Status: [R(ead) - D(eleted) - N(ew)]
Type: [cupon-general]...etc,
title: String,
Sent_ts:date,
contents:String,
headerImgs:Array[String],
footerImgs: Array[Strings],
cuponCode:String,
CuponSerial: long/String,
expiryDate: date
targetLink:Stirng
*/

const tableName = 'message';

export async function createTable() {
  const sqlCmd =
    `CREATE TABLE ${tableName}(

    )`;

  return await sqlRunner(sqlCmd);
}
