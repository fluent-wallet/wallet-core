import { VaultTypeEnum, type Database, type RxDocument, type DeepReadonly, type AccountDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { getTargetDocument, ParamsError, UnknowError } from '../../utils';

export const addAccountOfMnemonicVault = async ({ database }: { database: Database }, vaultIdOrVault: string | VaultDocType | DeepReadonly<VaultDocType>, accountParams?: { name?: string; }) => {
  const targetVault = await getTargetDocument<VaultDocType>(database, 'vaults', vaultIdOrVault);
  const isMnemonicVault = targetVault.type === VaultTypeEnum.mnemonic;
  if (!isMnemonicVault) {
    throw new ParamsError('Only mnemonic vault can add account.');
  }

  const accounts = ((await targetVault?.populate('accounts')) as Array<RxDocument<AccountDocType>>) ?? [];
  const lastAccount = accounts.at(-1);
  if (!lastAccount) {
    throw new UnknowError('Unknown error: no account in this vault.');
  }

  const newAccount = await database.accounts.insert({
    hdIndex: lastAccount.hdIndex + 1,
    name: accountParams?.name ?? `Account ${lastAccount.hdIndex + 2}`,
    hidden: false,
    vault: targetVault.id,
  } as AccountDocType);

  await targetVault.patch({
    accounts: [...(targetVault.accounts ?? []), newAccount.id],
  });

  return newAccount;
};
