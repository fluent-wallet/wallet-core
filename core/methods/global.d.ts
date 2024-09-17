import { createNewWallet as _createNewWallet } from './jest.setup';

declare global {
  var createNewWallet: typeof _createNewWallet;
}

export {};
