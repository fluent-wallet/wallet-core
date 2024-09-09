import * as R from 'ramda';
import { VaultType, VaultSource, PrivateKeyType, type Database } from '@cfx-kit/wallet-core-database/src';
import { handleUniquePrimaryKeyError } from '../utils';

const _addPrivateKeyVault = (database: Database, params: { privateKey: string, privateKeyType: PrivateKeyType; source: VaultSource }) =>
  R.pipe(
    () => ({
      value: params.privateKey,
      type: VaultType.privateKey,
      privateKeyType: params.privateKeyType,
      source: params.source,
      isBackup: params.source === VaultSource.import,
    }),
    database.vaults.insert.bind(database.vaults),
  )();

export const addPrivateKeyVault = handleUniquePrimaryKeyError(_addPrivateKeyVault);
