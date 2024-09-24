import { VaultTypeEnum, type Database, type DeepReadonly, type AccountDocType } from '@cfx-kit/wallet-core-database/src';
import { getTargetDocument, UnknowError } from '../../utils';
import { getVaultOfAccount } from './basic';

export const deleteAccount = async (database: Database, accountIdOrAccount: string | AccountDocType | DeepReadonly<AccountDocType>) => {
  const targetAccount = await getTargetDocument<AccountDocType>(database, 'accounts', accountIdOrAccount);
  const targetVault = await getVaultOfAccount(database, targetAccount.id);
  if (!targetVault) {
    throw new UnknowError('Unknown error: the vault of the account is not found.');
  }

  if (targetVault.type === VaultTypeEnum.privateKey) {

  }

  return targetAccount.remove();
};
