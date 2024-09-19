import { type Database, type VaultType } from '@cfx-kit/wallet-core-database/src';

export const getVaultsCountOfType = async (database: Database, type: VaultType) => database.vaults.count({ selector: { type } }).exec();
