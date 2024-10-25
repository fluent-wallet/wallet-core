import { beforeAll, describe, expect, test } from 'vitest';
import { VaultTypeEnum, VaultSourceEnum } from '@cfx-kit/wallet-core-database/src';
import { addMnemonicVault, validateMnemonic, englishWordList } from './addVault';
import { UniquePrimaryKeyError } from '../../utils/MethodError';

const { wallet, jestInitPromise } = global.createNewWallet({ encryptor: 'Memory' });
const { wallet: walletWithoutEncryptor, jestInitPromise: jestInitPromise2 } = global.createNewWallet({ encryptor: false });
beforeAll(() => Promise.all([jestInitPromise, jestInitPromise2]));

describe('addVault test', () => {
  test('create a new random mnemonic vault with Memory encryptor', async () => {
    const vault = await addMnemonicVault({ database: wallet.database });
    expect(vault).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        value: expect.any(String),
        type: VaultTypeEnum.mnemonic,
        source: VaultSourceEnum.create,
        isBackup: false,
      }),
    );
    expect(validateMnemonic(vault.value, englishWordList)).toBe(false);
  });

  test('create a new random mnemonic vault without encryptor', async () => {
    const vault = await addMnemonicVault({ database: walletWithoutEncryptor.database });
    expect(vault).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        value: expect.any(String),
        type: VaultTypeEnum.mnemonic,
        source: VaultSourceEnum.create,
        isBackup: false,
      }),
    );
    expect(validateMnemonic(vault.value, englishWordList)).toBe(true);
  });

  const aMnemonic = 'tag refuse output old identify oval major middle duck staff tube develop';
  test('import a mnemonic vault twice with Memory encryptor', async () => {
    const vault = await addMnemonicVault({ database: wallet.database }, { mnemonic: aMnemonic, source: VaultSourceEnum.import });
    expect(vault).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        value: expect.any(String),
        type: VaultTypeEnum.mnemonic,
        source: VaultSourceEnum.import,
        isBackup: true,
      }),
    );
    expect(validateMnemonic(vault.value, englishWordList)).toBe(false);

    await expect(addMnemonicVault({ database: wallet.database }, { mnemonic: aMnemonic, source: VaultSourceEnum.import })).rejects.toThrow(UniquePrimaryKeyError);
  });

  test('import a mnemonic vault twice without encryptor', async () => {
    const vault = await addMnemonicVault({ database: walletWithoutEncryptor.database }, { mnemonic: aMnemonic, source: VaultSourceEnum.import });
    expect(vault).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        value: aMnemonic,
        type: VaultTypeEnum.mnemonic,
        source: VaultSourceEnum.import,
        isBackup: true,
      }),
    );

    await expect(addMnemonicVault({ database: walletWithoutEncryptor.database }, { mnemonic: aMnemonic, source: VaultSourceEnum.import })).rejects.toThrow(UniquePrimaryKeyError);
  });
});
