import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import methods from './src/allMethods';
import { inject } from '@cfx-kit/wallet-core-react-inject/src';

const wallet = new WalletClass<typeof methods>();
wallet.init({
  databaseOptions: {
    storage: getRxStorageMemory(),
  },
  methods,
  injectDatabasePromise: [inject],
  injectDatabase: [(db) => {
    global.database = db;
  }],
});

global.waitForDatabaseInit = async () => await wallet.initPromise;
