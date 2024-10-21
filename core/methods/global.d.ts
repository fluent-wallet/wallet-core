import { createNewWallet as _createNewWallet } from './test.setup';

declare global {
  var createNewWallet: typeof _createNewWallet;
}

export {};
