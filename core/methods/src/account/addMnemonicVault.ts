import * as R from 'ramda';
import { generateMnemonic } from '@scure/bip39';
import { wordlist as englishWordList } from '@scure/bip39/wordlists/english';
export { generateMnemonic } from '@scure/bip39';
export { wordlist as englishWordList } from '@scure/bip39/wordlists/english';
export { validateMnemonic } from '@scure/bip39';
import { VaultType, VaultSource, type Database } from '@cfx-kit/wallet-core-database/src';
import { handleUniquePrimaryKeyError } from '../utils';

const _addMnemonicVault = (database: Database, importedMnemonic?: string) =>
  R.pipe(
    R.defaultTo(generateMnemonic(englishWordList)),
    (mnemonic: string) => ({
      value: mnemonic,
      type: VaultType.mnemonic,
      source: importedMnemonic ? VaultSource.import : VaultSource.create,
      isBackup: !!importedMnemonic,
    }),
    database.vaults.insert.bind(database.vaults),
  )(importedMnemonic);

export const addMnemonicVault = handleUniquePrimaryKeyError(_addMnemonicVault);
