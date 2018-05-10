const { connectToDb } = require('../util');

console.log(connectToDb)
describe('utils', () => {
  it('should be able to connect', async (done) => {
    const connection = await connectToDb();
    expect(typeof connection).toBe('object');
    done();
  });
});
