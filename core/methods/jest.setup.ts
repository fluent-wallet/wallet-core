import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import Encryptor from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor';

const wallet = new WalletClass({
  databaseOptions: {
    storage: getRxStorageMemory(),
    encryptor: new Encryptor(() => '12345678'),
  },
  injectDatabase: [
    (db) => {
      global.database = db;
    },
  ],
});

global.waitForDatabaseInit = async () => await wallet.initPromise;
