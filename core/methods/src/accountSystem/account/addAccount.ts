import { VaultTypeEnum, type Database, type RxDocument, type DeepReadonly, type AccountDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { getLastVaultAutoIndexOfType, generateDefaultVaultCode } from '../../../../methods/src/accountSystem/vault/basic';
import { getTargetDocument, ParamsError, UnknowError } from '../../utils';


export const addAccountOfMnemonicVault = async (database: Database, vaultIdOrVault: string | VaultDocType | DeepReadonly<VaultDocType>) => {
  const targetVault = await getTargetDocument<VaultDocType>(database, 'vaults', vaultIdOrVault);
  const isMnemonicVault = targetVault.type === VaultTypeEnum.mnemonic;
  if (!isMnemonicVault) {
    throw new ParamsError('Only mnemonic vault can add account.');
  }

  const accounts = (await targetVault?.populate('accounts')) as Array<RxDocument<AccountDocType>> ?? [];
  const lastAccount = accounts.at(-1);
  if (!lastAccount) {
    throw new UnknowError('Unknown error: no account in this vault.');
  }

  const newAccount = await database.accounts.insert({
    hdIndex: lastAccount.hdIndex + 1,
    name: `Account ${lastAccount.hdIndex + 2}`,
    hidden: false,
    vault: targetVault.id,
  } as AccountDocType);

  await targetVault.patch({
    accounts: [...(targetVault.accounts ?? []), newAccount.id],
  });

  return newAccount;
};


export const addFirstAccountOfVaultPipleline = async (database: Database) => database.vaults.addPipeline({
  identifier: 'addFirstAccountOfVaultPipleline',
  destination: database.accounts,
  handler: async (vaultsDoc) => {
    try {
      const newVaults = vaultsDoc.filter((doc) => !doc.deleted);
      const insertAccountsPromises = newVaults
        .map(async (vault) => {
          const isPrivateKeyVault = vault.type === VaultTypeEnum.privateKey;
          let name: string;
          if (isPrivateKeyVault) {
            const lastIndex = await getLastVaultAutoIndexOfType(database, vault.type);
            name = `PrivateKey Account ${generateDefaultVaultCode(lastIndex - 1)}`;
          } else {
            name = `Account 1`;
          }

          return {
            hdIndex: 0,
            name,
            hidden: false,
            vault: vault.id,
          } as AccountDocType;
        });

      const insertAccounts = await Promise.all(insertAccountsPromises);
      const result = await database.accounts.bulkInsert(insertAccounts);
      const patchVaults = result?.success?.map(async (account) => {
        const vault = await account.populate('vault') as RxDocument<VaultDocType>;
        await vault.patch({
          accounts: [...(vault.accounts ?? []), account.id],
        });
      });
      await Promise.all(patchVaults);
    } catch (error) {
      console.error('Failed to add first account of vault: ', error);
    }
  },
});