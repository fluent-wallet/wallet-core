import Encryptor from ".";

beforeAll(global.waitForDatabaseInit);

describe('Encryptor', () => {
  test('encrypt and decrypt', async () => {
    const encryptor = new Encryptor(() => '12345678');
    const a = await encryptor.encrypt('123');
    console.log(a);
  });
});
