import { addMnemonicVault } from './account/addMnemonicVault';
import { getPrivateKeyOfAccount } from './account/getPrivateKeyOfAccount';
import { addChain } from './chain/addChain';

const methods = {
  addMnemonicVault,
  getPrivateKeyOfAccount,
  addChain,
} as const;

export default methods;
