import React, { useEffect } from 'react';
import { IncorrectPasswordError, PasswordRequestUserCancelError } from '@cfx-kit/wallet-core-wallet/src';
import type WalletClass from '@cfx-kit/wallet-core-wallet/src';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';
import MemoryPassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/MemoryPassword';
import walletConfig from './walletConfig';
import { useObservableState } from '../hooks/useObservableState';

export const interactivePassword = new InteractivePassword();

/** Pass wallet through props to prevent circular dependency */
export const RespondInteractivePassword: React.FC<{ wallet: WalletClass }> = ({ wallet }) => {
  useEffect(() => {
    if (walletConfig.passwordMethod !== 'interactive') return;

    const subscription = interactivePassword.passwordRequest$.subscribe(async (request) => {
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
};

/** <--------------------------------------> */

export const memoryPassword = new MemoryPassword();
export const useIsPersistencePasswordSetted = () => useObservableState(memoryPassword.isPasswordSetted$, false);
