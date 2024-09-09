import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import methods from '@cfx-kit/wallet-core-methods/src/allMethods';

const wallet = new WalletClass<typeof methods>();
wallet.init({
  databaseOptions: {
    storage: getRxStorageDexie(),
  },
  methods,
});

export default wallet;
