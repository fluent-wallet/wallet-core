import { type Database, type DeepReadonly, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { getTargetDocument } from '../../utils';

export const deleteVault = async (database: Database, vaultIdOrVault: string | VaultDocType | DeepReadonly<VaultDocType>) => {
  const targetVault = await getTargetDocument<VaultDocType>(database, 'vaults', vaultIdOrVault);
  return targetVault.remove();
};

export const deleteAccountsOfVaultPipleline = async (database: Database) => database.vaults.addPipeline({
  identifier: 'deleteAccountsOfVaultPipleline',
  destination: database.accounts,
  handler: async (vaultsDoc) => {
    try {
      const removeAccounts = vaultsDoc
        .filter((doc) => doc.deleted)
        .map((vault) => vault.accounts ?? [])
        .flat();

      if (removeAccounts.length > 0) {
        await database.accounts.bulkRemove(removeAccounts);
      }
    } catch (error) {
      console.error('Failed to delete accounts of vault: ', error);
    }
  },
});