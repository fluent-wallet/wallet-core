import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from './src';
import methods from '../methods/src/allMethods';
import ConfluxChainMethods, { ConfluxNetworkType } from '../../chains/conflux/src';

const chains = {
  [ConfluxNetworkType]: ConfluxChainMethods,
};

const wallet = new WalletClass<typeof methods, typeof chains>({
  databaseOptions: {
    storage: getRxStorageMemory(),
  },
  methods,
  chains,
  injectDatabase: [
    (db) => {
      global.database = db;
    },
  ],
});

export type Wallet = typeof wallet;
global.wallet = wallet;
global.waitForDatabaseInit = async () => await wallet.initPromise;
