import { addRxPlugin, createRxDatabase, type RxDatabase } from 'rxdb';
import { vaultSchema, type VaultCollection } from './models/Vault';
import { accountSchema, type AccountCollection } from './models/Account';
import { addressSchema, type AddressCollection } from './models/Address';
import { chainSchema, type ChainCollection } from './models/Chain';
import { hdPathSchema, type HdPathCollection } from './models/HdPath';
import TimestampPlugin from './plugins/timestamp';
import IndexPlugin from './plugins/autoIndex';
export { VaultTypeEnum as VaultType, VaultSourceEnum as VaultSource, PrivateKeyTypeEnum as PrivateKeyType } from './models/Vault';
addRxPlugin(TimestampPlugin);
addRxPlugin(IndexPlugin);

export interface DatabaseCollections {
  vaults: VaultCollection;
  accounts: AccountCollection;
  addresses: AddressCollection;
  chains: ChainCollection;
  hd_paths: HdPathCollection;
}

export type Database = RxDatabase<DatabaseCollections>;

type Storage = Parameters<typeof createRxDatabase>[0]['storage'];

export const createDatabase = async ({ storage }: { storage: Storage }) => {
  const database: Database = await createRxDatabase<DatabaseCollections>({
    name: 'wallet-core',
    storage,
    multiInstance: true,
  });

  await database.addCollections({
    vaults: {
      schema: vaultSchema,
      options: vaultSchema.options,
    },
    accounts: {
      schema: accountSchema,
    },
    addresses: {
      schema: addressSchema,
    },
    chains: {
      schema: chainSchema,
    },
    hd_paths: {
      schema: hdPathSchema,
    },
  });
  return database;
};