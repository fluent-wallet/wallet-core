
import { randomUUID } from 'crypto';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import Encryptor from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';
import MemoryPassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/MemoryPassword';

export const createNewWallet = ({ encryptor = 'Memory', dbName = randomUUID() }: { encryptor: 'Interactive' | 'Memory' | false; dbName?: string }) => {
  const password = encryptor === 'Memory' ? new MemoryPassword() : new InteractivePassword();

  const wallet = new WalletClass({
    databaseOptions: {
      dbName,
      storage: getRxStorageMemory(),
      encryptor: encryptor ? new Encryptor(password.getPassword.bind(password)) : undefined,
    },
  });

  const jestInitPromise = wallet.initPromise.then(() => {
    wallet.methods.initPassword('12345678');
  });

  if (password instanceof MemoryPassword) {
    password.setPassword('12345678');

    return {
      wallet,
      jestInitPromise,
    };
  }
  
  return {
    wallet,
    jestInitPromise
  };
};

global.createNewWallet = createNewWallet;
