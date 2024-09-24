import { addRxPlugin, createRxDatabase, type RxDatabase, type RxState } from 'rxdb';
import { vaultSchema, type VaultDocType, type VaultDocTypeEnhance,  type VaultCollection, type Encryptor, VaultTypeEnum, type VaultType, VaultSourceEnum, type VaultSource } from './models/Vault';
import { accountSchema, type AccountDocType, type AccountCollection } from './models/Account';
import { addressSchema, type AddressDocType, type AddressCollection } from './models/Address';
import { chainSchema, type ChainDocType, type ChainCollection } from './models/Chain';
import { hdPathSchema, type HdPathDocType, type HdPathCollection } from './models/HdPath';
import { RxDBStatePlugin } from 'rxdb/plugins/state';
import { RxDBPipelinePlugin } from 'rxdb/plugins/pipeline';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import TimestampPlugin from './plugins/timestamp';
import AutoIndexPlugin from './plugins/autoIndex';
import UniqueIdPlugin from './plugins/uniqueId';
export { RxError, type RxDocument, type DeepReadonly } from 'rxdb';
export {
  VaultTypeEnum,
  VaultSourceEnum,
  VaultDocType,
  VaultDocTypeEnhance,
  VaultCollection,
  VaultType,
  VaultSource,
  AccountDocType,
  AccountCollection,
  AddressDocType,
  AddressCollection,
  ChainDocType,
  ChainCollection,
  HdPathDocType,
  HdPathCollection,
}

addRxPlugin(RxDBStatePlugin);
addRxPlugin(RxDBPipelinePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(TimestampPlugin);
addRxPlugin(UniqueIdPlugin);
addRxPlugin(AutoIndexPlugin);
addRxPlugin(RxDBCleanupPlugin);

export interface DatabaseCollections {
  vaults: VaultCollection;
  accounts: AccountCollection;
  addresses: AddressCollection;
  chains: ChainCollection;
  hd_paths: HdPathCollection;
}

export type Database = RxDatabase<DatabaseCollections>;

type Storage = Parameters<typeof createRxDatabase>[0]['storage'];

interface DBState {
  encryptorContent: string;
}

export const createDatabase = async ({ storage, encryptor, dbName = 'wallet-core' }: { storage: Storage; dbName?: string; encryptor?: Encryptor }) => {
  const database: Database = await createRxDatabase<DatabaseCollections>({
    name: dbName,
    storage,
    multiInstance: true,
  });

  const state: RxState<DBState> = await database.addState();

  await database.addCollections({
    vaults: {
      schema: vaultSchema,
      options: vaultSchema.options,
      ...(encryptor
        ? {
            statics: {
              encrypt: encryptor.encrypt.bind(encryptor),
              decrypt: encryptor.decrypt.bind(encryptor),
            },
          }
        : null),
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
  return {
    database,
    state,
  } as const;
};
