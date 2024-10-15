import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import methods from '@cfx-kit/wallet-core-methods/src/allMethods';
import { inject } from '@cfx-kit/wallet-core-react-inject/src';
import Encryptor from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor';
import walletConfig from './walletConfig';
import { interactivePassword, memoryPassword } from './passwordMethod';
import {
  chains,
  EthereumSepolia,
  EVMNetworkType,
  SolanaNetworkType,
  ConfluxNetworkType,
  EthereumMainnet,
  SolanaTestnet,
  SolanaMainnet,
  ConfluxTestnet,
  ConfluxMainnet,
} from './chains';
export * from './passwordMethod';
export { default as walletConfig } from './walletConfig';

const wallet = new WalletClass<typeof methods, typeof chains>({
  databaseOptions: {
    storage: walletConfig.storageMethod === 'Memory' ? getRxStorageMemory() : getRxStorageDexie(),
    encryptor:
      walletConfig.passwordMethod === 'persistence' ?
        new Encryptor(memoryPassword.getPassword.bind(memoryPassword))
        : new Encryptor(interactivePassword.getPassword.bind(interactivePassword)),
  },
  methods,
  chains,
  injectDatabasePromise: [inject],
});

(async () => {
  wallet.initPromise.then(() => {
    wallet.methods.addChain({ ...EthereumSepolia, type: EVMNetworkType });
    wallet.methods.addChain({ ...EthereumMainnet, type: EVMNetworkType });
    // wallet.methods.addChain({ ...SolanaTestnet, type: SolanaNetworkType });
    // wallet.methods.addChain({ ...SolanaMainnet, type: SolanaNetworkType });
    // wallet.methods.addChain({ ...ConfluxTestnet, type: ConfluxNetworkType });
    // wallet.methods.addChain({ ...ConfluxMainnet, type: ConfluxNetworkType });
  });
})();

export default wallet;