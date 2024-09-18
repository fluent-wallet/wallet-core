import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import WalletClass, { IncorrectPassworError } from '@cfx-kit/wallet-core-wallet/src';
import methods from '@cfx-kit/wallet-core-methods/src/allMethods';
import { inject } from '@cfx-kit/wallet-core-react-inject/src';
import Encryptor from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';
import MemoryPassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/MemoryPassword';
import { PasswordRequestUserCancelError } from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';

export const useMemoryPassword = true;

export const interactivePassword = new InteractivePassword();
export const memoryPassword = new MemoryPassword();

const wallet = new WalletClass<typeof methods>({
  databaseOptions: {
    storage: getRxStorageDexie(),
    encryptor: useMemoryPassword ? new Encryptor(memoryPassword.getPassword.bind(memoryPassword)) : new Encryptor(interactivePassword.getPassword.bind(interactivePassword)),
  },
  methods,
  injectDatabasePromise: [inject],
});

export default wallet;

const initPasswordPromise = wallet.methods.initPassword('12345678');

async function interactivePasswordExample() {
  await initPasswordPromise;
  interactivePassword.passwordRequest$.subscribe(async (request) => {
    const password = prompt('Please input password', '12345678');
    if (password) {
      if (await wallet.methods.validatePassword(password)) {
        request.resolve(password);
      } else {
        request.reject(new IncorrectPassworError());
      }
    } else {
      request.reject(new PasswordRequestUserCancelError());
    }
  });
}

async function memoryPasswordExample() {
  await initPasswordPromise;
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
