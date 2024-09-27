import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import Encryptor from './src/mechanism/Encryptor';
import type InteractivePassword from './src/mechanism/Encryptor/Password/InteractivePassword';
import type MemoryPassword from './src/mechanism/Encryptor/Password/MemoryPassword';
import WalletClass from './src';
import methods from '../methods/src/allMethods';
import ConfluxChainMethods, { ConfluxNetworkType, ConfluxChainMethodsClass } from '../../chains/conflux/src';

const chains = {
  [ConfluxNetworkType]: ConfluxChainMethods,
  ['custom-Conflux']: new ConfluxChainMethodsClass(`m/44'/50333'/0'/0/0`),
};

const wallet = new WalletClass<typeof methods, typeof chains>({
  databaseOptions: {
    storage: getRxStorageMemory(),
    encryptor: new Encryptor(() => '12345678'),
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
