import { deleteTable, updateCount, updateUser, findAll, createTable, findUser, insertUser, deleteUser } from '../unread-messages-count';

const userId = '8096399897';
const dummyVal1 = 5;
const dummyVal2 = 10;

// for update user
const customUserId = '000000000';

describe('unread-messages-count', () => {

  beforeAll(async (done) => {
    // console.info('inserting user');
    // await insertUser(userId, dummyVal1);
    // console.info('insert user');
    done()
  });

  afterAll(async (done) => {
    console.info('deleting user');
    await deleteUser(userId);
    console.info('deleted user');
    done();
  });

  it('should update count', async (done) => {
    try {
      const result = await updateCount(userId, dummyVal2);
      expect(result).toHaveProperty('rowsAffected');
      expect(result.rowsAffected).toEqual(1);
      done();
    } catch (e) {
      throw e;
    }
  });

  it('should find all users', async (done) => {
    try {
      const result = await findAll()
      expect(result).toHaveProperty('rows');
      expect(result.rows).toHaveProperty('length');
      done();
    } catch (e) {
      throw e;
    }
  });

  it('should find user', async (done) => {
    try {
      const result = await findUser(userId);
      expect(result).toHaveProperty('rows');
      expect(result.rows).toHaveProperty('length');
      expect(result.rows[0][0]).toEqual(userId);
      done();
    } catch (e) {
      throw e;
    }
  });

  it('should create user and update value if not created', async (done) => {
    // try {
    //   const result = await updateUser(userId, dummyVal1);
    //   expect(result).toHaveProperty('rows');
    //   expect(result.rows).toHaveProperty('length');
    //   expect(result.rows[0][0]).toEqual(userId);
    //   done();
    // } catch (e) {
    //   throw e;
    // }
    done();
  });
});
