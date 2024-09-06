import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@repo/wallet/src';
import methods from './src/allMethods';
import { inject } from '@repo/react-inject/src';

const database = new WalletClass<typeof methods>();
database.init({
  databaseOptions: {
    storage: getRxStorageMemory(),
  },
  methods,
  injectDatabasePromise: [inject],
}).then((db) => global.database = db);

global.waitForDatabaseInit = async () => await database.initPromise;
