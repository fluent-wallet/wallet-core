import { type Database, type VaultType } from '@cfx-kit/wallet-core-database/src';
import { type VaultDocTypeEnhance } from '@cfx-kit/wallet-core-database/src/models/Vault';

export const getVaultsCountOfType = async (database: Database, type: VaultType) => database.vaults.count({ selector: { type } }).exec();
export const getLastVaultAutoIndexOfType = async (database: Database, type: VaultType) =>
  database.vaults
    .findOne({ selector: { type }, sort: [{ autoIndex: 'desc' }] })
    .exec()
    .then((doc) => {
      if (!doc) return 0;
      return (doc as unknown as VaultDocTypeEnhance).autoIndex;
    });
