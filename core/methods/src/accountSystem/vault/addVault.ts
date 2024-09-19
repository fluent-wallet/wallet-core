import * as R from 'ramda';
import { generateMnemonic, validateMnemonic } from '@scure/bip39';
import { wordlist as englishWordList } from '@scure/bip39/wordlists/english';
export { generateMnemonic, validateMnemonic, englishWordList };
import { VaultSourceEnum, VaultTypeEnum, type VaultSource, type Database } from '@cfx-kit/wallet-core-database/src';
import { type VaultDocType } from '@cfx-kit/wallet-core-database/src/models/Vault';
import { encryptVaultValue, isVaultExist } from './vaultEncryptor';
import { getLastVaultAutoIndexOfType } from './basic';
import { UniquePrimaryKeyError } from '../../utils/MethodError';

const encryptField = R.curry(async <T extends Record<string, any>>(database: Database, field: keyof T, obj: T) => {
  const encryptedValue = await encryptVaultValue(database, obj[field]);
  return {
    ...obj,
    [field]: encryptedValue,
  } as T;
}) as <T extends Record<string, any>>(database: Database, field: keyof T, obj: T) => Promise<T>;

const checkMnemonicExist = R.curry((database: Database, params: Required<MnemonicVaultParams>) =>
  isVaultExist(database, { value: params.mnemonic, type: VaultTypeEnum.mnemonic }).then((exists) =>
    exists ? Promise.reject(new UniquePrimaryKeyError('The mnemonic already exists in wallet.')) : params,
  ),
);

export interface MnemonicVaultParams {
  name?: string;
  mnemonic?: string;
  source?: VaultSource;
}

export const addMnemonicVault = (database: Database, params?: MnemonicVaultParams) =>
  R.pipe(
    R.mergeRight({
      mnemonic: undefined,
      source: undefined,
      name: undefined,
    }),
    R.evolve({
      mnemonic: R.defaultTo(generateMnemonic(englishWordList)),
      source: R.defaultTo(VaultSourceEnum.create),
    }) as (params: MnemonicVaultParams) => Required<MnemonicVaultParams>,
    (params) => checkMnemonicExist(database, params),
    R.andThen((params: Required<MnemonicVaultParams>) =>
      getLastVaultAutoIndexOfType(database, VaultTypeEnum.mnemonic).then((index) => ({ ...params, name: params.name || `Wallet ${index + 1}` })),
    ),
    R.andThen((params: Required<MnemonicVaultParams>) => encryptField(database, 'mnemonic', params)),
    R.andThen(({ mnemonic, source, name }) => ({
      name,
      value: mnemonic,
      type: VaultTypeEnum.mnemonic,
      source,
      isBackup: source === VaultSourceEnum.import,
    })),
    R.andThen((data) => database.vaults.insert(data as unknown as VaultDocType)),
  )(params);

/* <----------------------------------------------------------------------------------------------------------------> */

export interface PrivateKeyVaultParams {
  name?: string;
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
    R.andThen(({ privateKey, source, name }) => ({
      name: name ?? '',
      value: privateKey,
      type: VaultTypeEnum.privateKey,
      source,
      isBackup: source === VaultSourceEnum.import,
    })),
    R.andThen((data) => database.vaults.insert(data as unknown as VaultDocType)),
  )(params);
