import * as R from 'ramda';
import { generateMnemonic, validateMnemonic } from '@scure/bip39';
import { wordlist as englishWordList } from '@scure/bip39/wordlists/english';
export { generateMnemonic, validateMnemonic, englishWordList };
import { VaultSourceEnum, VaultTypeEnum, type VaultSource, type Database } from '@cfx-kit/wallet-core-database/src';
import { encryptVaultValue, isVaultExist } from './vaultEncryptor';
import { UniquePrimaryKeyError } from '../../utils/MethodError';

const encryptField = R.curry(async <T extends Record<string, any>>(database: Database, field: keyof T, obj: T) => {
  const encryptedValue = await encryptVaultValue(database, obj[field]);
  return {
    ...obj,
    [field]: encryptedValue,
  } as T;
}) as <T extends Record<string, any>>(database: Database, field: keyof T, obj: T) => Promise<T>;

const checkMnemonicExist = R.curry((database: Database, params: MnemonicVaultParams) =>
  isVaultExist(database, { value: params.mnemonic, type: VaultTypeEnum.mnemonic }).then((exists) =>
    exists ? Promise.reject(new UniquePrimaryKeyError('The mnemonic already exists in wallet.')) : params,
  ),
);

export interface MnemonicVaultParams {
  mnemonic: string;
  source: VaultSource;
}

export const addMnemonicVault = (database: Database, params?: MnemonicVaultParams) =>
  R.pipe(
    R.defaultTo({ mnemonic: generateMnemonic(englishWordList), source: VaultSourceEnum.create }),
    (params: MnemonicVaultParams) => checkMnemonicExist(database, params),
    R.andThen((params: MnemonicVaultParams) => encryptField(database, 'mnemonic', params)),
    R.andThen(({ mnemonic, source }) => ({
      value: mnemonic,
      type: VaultTypeEnum.mnemonic,
      source,
      isBackup: source === VaultSourceEnum.import,
    })),
    R.andThen((data) => database.vaults.insert(data)),
  )(params);

/* <----------------------------------------------------------------------------------------------------------------> */

export interface PrivateKeyVaultParams {
  privateKey: string;
  source: VaultSource;
}

const checkPrivateKeyExist = R.curry((database: Database, params: PrivateKeyVaultParams) =>
  isVaultExist(database, { value: params.privateKey, type: VaultTypeEnum.privateKey }).then((exists) =>
    exists ? Promise.reject(new UniquePrimaryKeyError('The privateKey already exists in wallet.')) : params,
  ),
);

export const addPrivateKeyVault = (database: Database, params: PrivateKeyVaultParams) =>
  R.pipe(
    (params: PrivateKeyVaultParams) => checkPrivateKeyExist(database, params),
    R.andThen((params: PrivateKeyVaultParams) => encryptField(database, 'privateKey', params)),
    R.andThen(({ privateKey, source }) => ({
      value: privateKey,
      type: VaultTypeEnum.privateKey,
      source,
      isBackup: source === VaultSourceEnum.import,
    })),
    R.andThen((data) => database.vaults.insert(data)),
  )(params);
