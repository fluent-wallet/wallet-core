import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';

const wallet = new WalletClass();
wallet.init({
  databaseOptions: {
    storage: getRxStorageMemory(),
  },
  injectDatabase: [(db) => {
    global.database = db;
  }],
});

global.waitForDatabaseInit = async () => await wallet.initPromise;
