import { defineBackground } from 'wxt/sandbox';
import { onMessage } from './messaging';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import methods from '@cfx-kit/wallet-core-methods/src/allMethods';
import { inject } from '@cfx-kit/wallet-core-react-inject/src';

export default defineBackground({
  type: 'module',
  main: () => {
    const wallet = new WalletClass<typeof methods>({
      databaseOptions: {
        storage: getRxStorageDexie(),
      },
      methods,
      injectDatabasePromise: [inject],
      extensionType: 'background'
    });
  },
});
