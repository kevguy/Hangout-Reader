import { connectToDb } from '../utils';
// import { IConnection } from 'oracledb';

describe('utils', () => {
  it('should be able to connect', async (done) => {
    const connection = await connectToDb();
    expect(typeof connection).toBe('object');
    done();
  });
});
