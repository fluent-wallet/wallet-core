import { type Database, type DeepReadonly, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { getTargetDocument } from '../../utils';

export const deleteVault = async (database: Database, vaultIdOrVault: string | VaultDocType | DeepReadonly<VaultDocType>) => {
  const targetVault = await getTargetDocument<VaultDocType>(database, 'vaults', vaultIdOrVault);
  return targetVault.remove();
};
