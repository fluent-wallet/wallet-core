import { beforeAll, describe, expect, it } from 'vitest';
import { encryptVaultValue, decryptVaultValue, isVaultExist } from './vaultEncryptor';
import { addMnemonicVault, addPrivateKeyVault } from './addVault';

const { wallet } = global.createNewWallet({ encryptor: 'Memory' });
const { wallet: walletInteractive } = global.createNewWallet({ encryptor: 'Interactive' });
const { wallet: walletWithoutEncryptor } = global.createNewWallet({ encryptor: false });
beforeAll(() => Promise.all([wallet.initPromise, walletWithoutEncryptor.initPromise]));

describe('vaultEncrypto test', () => {
  it('it should encrypt value in wallet with Memory encryptor', async () => {
    const encryptedValue = await encryptVaultValue({ database: wallet.database }, 'test');
    expect(encryptedValue).not.toBe('test');

    const decryptedValue = await decryptVaultValue({ database: wallet.database }, encryptedValue);
    expect(decryptedValue).toBe('test');
  });

  it('should not encrypt value in wallet without encryptor', async () => {
    const encryptedValue = await encryptVaultValue({ database: walletWithoutEncryptor.database }, 'test');
    expect(encryptedValue).toBe('test');

    const decryptedValue = await decryptVaultValue({ database: walletWithoutEncryptor.database }, encryptedValue);
    expect(decryptedValue).toBe('test');
  });

  it('should check if vault exists in wallet with Memory encryptor', async () => {
    const mnemonic = 'test';
    const isExistBeforeAdd = await isVaultExist({ database: wallet.database }, { value: mnemonic, type: 'mnemonic' });
    expect(isExistBeforeAdd).toBe(false);
    const privateKey = 'test2';
    const isExistBeforeAdd2 = await isVaultExist({ database: wallet.database }, { value: privateKey, type: 'privateKey' });
    expect(isExistBeforeAdd2).toBe(false);

    await addMnemonicVault({ database: wallet.database }, { mnemonic, source: 'create' });
    await addPrivateKeyVault({ database: wallet.database }, { privateKey, source: 'import' });
    const isExistAfterAdd = await isVaultExist({ database: wallet.database }, { value: mnemonic, type: 'mnemonic' });
    expect(isExistAfterAdd).toBe(true);

    const isExistAfterAdd2 = await isVaultExist({ database: wallet.database }, { value: privateKey, type: 'privateKey' });
    expect(isExistAfterAdd2).toBe(true);
  });

  it('should check if vault exists in wallet without encryptor', async () => {
    const mnemonic = 'test';
    const isExistBeforeAdd = await isVaultExist({ database: walletWithoutEncryptor.database }, { value: mnemonic, type: 'mnemonic' });
    expect(isExistBeforeAdd).toBe(false);
    const privateKey = 'test2';
    const isExistBeforeAdd2 = await isVaultExist({ database: walletWithoutEncryptor.database }, { value: privateKey, type: 'privateKey' });
    expect(isExistBeforeAdd2).toBe(false);

    await addMnemonicVault({ database: walletWithoutEncryptor.database }, { mnemonic, source: 'create' });
    await addPrivateKeyVault({ database: walletWithoutEncryptor.database }, { privateKey, source: 'import' });
    const isExistAfterAdd = await isVaultExist({ database: walletWithoutEncryptor.database }, { value: mnemonic, type: 'mnemonic' });
    expect(isExistAfterAdd).toBe(true);

    const isExistAfterAdd2 = await isVaultExist({ database: walletWithoutEncryptor.database }, { value: privateKey, type: 'privateKey' });
    expect(isExistAfterAdd2).toBe(true);
  });
});
