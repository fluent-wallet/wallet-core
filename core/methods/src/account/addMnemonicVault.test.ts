import { addMnemonicVault } from './addMnemonicVault';
import { VaultType, VaultSource } from '@cfx-kit/wallet-core-database/src';
import { UniquePrimaryKeyError } from '../utils/MethodError';
beforeAll(global.waitForDatabaseInit);

describe('addMnemonicVault', () => {
  test('create a new random mnemonic vault', async () => {
    const vault = await addMnemonicVault(global.database);
    expect(vault).toEqual(
      expect.objectContaining({
        value: expect.any(String),
        type: VaultType.mnemonic,
        source: VaultSource.create,
        isBackup: false,
      }),
    );
  });

  const aMnemonic = 'tag refuse output old identify oval major middle duck staff tube develop';
  test('import a mnemonic vault', async () => {
    const vault = await addMnemonicVault(global.database, aMnemonic);
    expect(vault).toEqual(
      expect.objectContaining({
        value: expect.any(String),
        type: VaultType.mnemonic,
        source: VaultSource.import,
        isBackup: true,
      }),
    );
  });

  test('import a exist mnemonic', async () => {
    await expect(addMnemonicVault(global.database, aMnemonic)).rejects.toThrow(UniquePrimaryKeyError);
  });
});