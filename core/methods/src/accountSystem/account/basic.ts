import { type Database, type RxDocument, type AccountDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { NoDocumentError } from '../../utils/MethodError';

export const getVaultOfAccount = (database: Database, accountIdorAccount: AccountDocType | string) =>
  database.accounts
    .findOne(typeof accountIdorAccount === 'string' ? accountIdorAccount : accountIdorAccount.id)
    .exec()
    .then(async (account) => {
      if (!account) {
        throw new NoDocumentError(`Account with id ${typeof accountIdorAccount === 'string' ? accountIdorAccount : accountIdorAccount.id} not found in database`);
      }
      const vault = (await account?.populate('vault')) as RxDocument<VaultDocType>;
      return vault;
    });
