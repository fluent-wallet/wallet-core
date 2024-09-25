import { VaultTypeEnum, type RxDocument, type Database, type DeepReadonly, type AccountDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { getTargetDocument, UnknowError } from '../../utils';
import { updateAccount } from './basic';

export const deleteAccount = async (database: Database, accountIdOrAccount: string | AccountDocType | DeepReadonly<AccountDocType>) => {
  const targetAccount = await getTargetDocument<AccountDocType>(database, 'accounts', accountIdOrAccount);
  const targetVault = await targetAccount.populate('vault') as RxDocument<VaultDocType>;
  if (!targetVault) {
    throw new UnknowError('Unknown error: the vault of the account is not found.');
  }

  if (targetVault.type === VaultTypeEnum.mnemonic) {
    return await updateAccount(database, targetAccount.id, { hidden: true });
  } else {
    await targetVault.remove();
    return await targetAccount.remove();
  }
};
