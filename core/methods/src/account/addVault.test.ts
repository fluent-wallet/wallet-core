import { addMnemonicVault } from './addVault';
import { VaultTypeEnum, VaultSourceEnum } from '@cfx-kit/wallet-core-database/src';
import { UniquePrimaryKeyError } from '../utils/MethodError';
beforeAll(global.waitForDatabaseInit);

describe('addMnemonicVault', () => {
  test('create a new random mnemonic vault', async () => {
    const vault = await addMnemonicVault(global.database);
    console.log(vault);
    expect(vault).toEqual(
      expect.objectContaining({
        value: expect.any(String),
        type: VaultTypeEnum.mnemonic,
        source: VaultSourceEnum.create,
        isBackup: false,
      }),
    );
  });

  // const aMnemonic = 'tag refuse output old identify oval major middle duck staff tube develop';
  // test('import a mnemonic vault', async () => {
  //   const vault = await addMnemonicVault(global.database, { mnemonic: aMnemonic, source: VaultSourceEnum.import });
  //   expect(vault).toEqual(
  //     expect.objectContaining({
  //       value: expect.any(String),
  //       type: VaultTypeEnum.mnemonic,
  //       source: VaultSourceEnum.import,
  //       isBackup: true,
  //     }),
  //   );
  // });

  // test('import a exist mnemonic', async () => {
  //   await expect(addMnemonicVault(global.database, { mnemonic: aMnemonic, source: VaultSourceEnum.import })).rejects.toThrow(UniquePrimaryKeyError);
  // });
});
