import * as R from 'ramda';
import { generateMnemonic } from '@scure/bip39';
import { wordlist as englishWordList } from '@scure/bip39/wordlists/english';
export { generateMnemonic } from '@scure/bip39';
export { wordlist as englishWordList } from '@scure/bip39/wordlists/english';
export { validateMnemonic } from '@scure/bip39';
import { VaultSourceEnum, VaultTypeEnum, type VaultSource, type Database } from '@cfx-kit/wallet-core-database/src';
import { encryptVaultValue, isVaultExist } from './encryptOfValut';
import { handleUniquePrimaryKeyError } from '../utils';

const checkIsMnemonicExist = R.curry((database: Database, params: MnemonicVaultParams) =>
  isVaultExist(database, { value: params.mnemonic, type: VaultTypeEnum.mnemonic }).then((exists) => {
    if (exists) throw new Error('Vault already exists');
    return params;
  }),
);

export interface MnemonicVaultParams {
  mnemonic: string;
  source: VaultSource;
}

const _addMnemonicVault = async (database: Database, params?: MnemonicVaultParams) =>
  R.pipe(
    R.defaultTo({ mnemonic: generateMnemonic(englishWordList), source: VaultSourceEnum.create }) as unknown as any,
    (params: MnemonicVaultParams) => checkIsMnemonicExist(database, params) as any,
    (params: MnemonicVaultParams) => encryptVaultValue(database, 'mnemonic', params),
    R.andThen(({ mnemonic, source }) => ({
      value: mnemonic,
      type: VaultTypeEnum.mnemonic,
      source,
      isBackup: source === VaultSourceEnum.import,
    })),
    R.andThen(database.vaults.insert.bind(database.vaults)),
  )(params);

export const addMnemonicVault = handleUniquePrimaryKeyError(_addMnemonicVault);

export interface PrivateKeyVaultParams {
  privateKey: string;
  source: VaultSource;
}

const _addPrivateKeyVault = async (database: Database, params: PrivateKeyVaultParams) =>
  R.pipe(
    (params: PrivateKeyVaultParams) => encryptVaultValue(database, 'privateKey', params),
    R.andThen(({ privateKey, source }) => ({
      value: privateKey,
      type: VaultTypeEnum.privateKey,
      source,
      isBackup: source === VaultSourceEnum.import,
    })),
    R.andThen(database.vaults.insert.bind(database.vaults)),
  )(params);

export const addPrivateKeyVault = handleUniquePrimaryKeyError(_addPrivateKeyVault);
