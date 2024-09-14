import { type AccountDocType } from '@cfx-kit/wallet-core-database/src/models/Account';
import { type VaultDocType } from '@cfx-kit/wallet-core-database/src/models/Vault';
import { type Database } from '@cfx-kit/wallet-core-database/src';
import { NoDocumentError } from '../utils/MethodError';

export const getVaultOfAccount = (database: Database, account: AccountDocType | string) =>
  database.accounts
    .findOne(typeof account === 'string' ? account : account.id)
    .exec()
    .then(async (accountDoc) => {
      if (!accountDoc) {
        throw new NoDocumentError(`Account with id ${typeof account === 'string' ? account : account.id} not found in database`);
      }
      const vault = (await accountDoc?.populate('vault')) as unknown as VaultDocType;
      return vault;
    });

export const getValueOfVault = (database: Database, vault: VaultDocType) => vault.value;
