import { type Database } from '@cfx-kit/wallet-core-database/src';
import { type VaultDocType } from '@cfx-kit/wallet-core-database/src/models/Vault';
import { type DeepReadonly } from 'rxdb';

export const deleteVault = async (database: Database, vaultOrValue: string | VaultDocType | DeepReadonly<VaultDocType>) => {
  const targetVaultValue = typeof vaultOrValue === 'string' ? vaultOrValue : vaultOrValue?.value;
  if (!targetVaultValue) {
    return Promise.reject(new Error('Invalid vault value'));
  }
  const targetVault = await database.vaults.findOne(targetVaultValue).exec();
  if (!targetVault) {
    return Promise.reject(new Error('Vault not found'));
  }
  return targetVault.remove();
};
