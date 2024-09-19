import { type Database } from '@cfx-kit/wallet-core-database/src';
import { type VaultDocType } from '@cfx-kit/wallet-core-database/src/models/Vault';
import { type DeepReadonly } from 'rxdb';
import { ParamsError, NoDocumentError } from '../../utils';

export const deleteVault = async (database: Database, vaultIdOrVault: string | VaultDocType | DeepReadonly<VaultDocType>) => {
  const targetId = typeof vaultIdOrVault === 'string' ? vaultIdOrVault : vaultIdOrVault?.id;
  if (!targetId) {
    return Promise.reject(new ParamsError('Invalid vault or id.'));
  }

  const targetVault = await database.vaults.findOne(targetId).exec();
  if (!targetVault) {
    return Promise.reject(new NoDocumentError('No vault found in the database.'));
  }

  return targetVault.remove();
};
