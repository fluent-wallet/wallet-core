import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass, { IncorrectPasswordError } from '@cfx-kit/wallet-core-wallet/src';
import methods from '@cfx-kit/wallet-core-methods/src/allMethods';
import { inject } from '@cfx-kit/wallet-core-react-inject/src';
import Encryptor from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';
import MemoryPassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/MemoryPassword';
import { PasswordRequestUserCancelError } from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';
import EVMChainMethods, { EVMNetworkType } from '../../../chains/evm/src';
import SolanaChainMethods, { SolanaNetworkType } from '../../../chains/solana/src';

const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

const useMemoryStorage = true;
const useMemoryPassword = true;

export const interactivePassword = new InteractivePassword();
export const memoryPassword = new MemoryPassword();

const wallet = new WalletClass<typeof methods, typeof chains>({
  databaseOptions: {
    storage: useMemoryStorage ? getRxStorageMemory() : getRxStorageDexie(),
    encryptor: useMemoryPassword ? new Encryptor(memoryPassword.getPassword.bind(memoryPassword)) : new Encryptor(interactivePassword.getPassword.bind(interactivePassword)),
  },
  methods,
  chains,
  injectDatabasePromise: [inject],
});

export default wallet;

async function interactivePasswordExample() {
  await wallet.methods.initPassword('12345678');
  interactivePassword.passwordRequest$.subscribe(async (request) => {
    const password = prompt('Please input password', '12345678');
    if (password) {
      if (await wallet.methods.validatePassword(password)) {
        request.resolve(password);
      } else {
        request.reject(new IncorrectPasswordError());
      }
    } else {
      request.reject(new PasswordRequestUserCancelError());
    }
  });
}

async function memoryPasswordExample() {
  await wallet.methods.initPassword('12345678');
  let isValid = false;
  while (!isValid) {
    const password = prompt('Please set memory password', '12345678');
    isValid = await wallet.methods.validatePassword(password);
    if (isValid) {
      memoryPassword.setPassword(password!);
      console.log('Password set successfully');
    } else {
      console.log('Invalid password. Please try again.');
    }
  }
}

wallet.initPromise.then(() => {
  if (useMemoryPassword) {
    memoryPasswordExample();
  } else {
    interactivePasswordExample();
  }
});
