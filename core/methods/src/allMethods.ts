import { addMnemonicVault } from './account/addMnemonicVault';
import { getPrivateKeyOfAccountInChain } from './account/getPrivateKeyOfAccount';
import { addChain } from './chain/addChain';

const methods = {
  addMnemonicVault,
  getPrivateKeyOfAccountInChain,
  addChain,
} as const;

export default methods;
