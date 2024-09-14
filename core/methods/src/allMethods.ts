import { addMnemonicVault } from './account/addVault';
import { getPrivateKeyOfAccountInChain } from './account/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';

const methods = {
  addMnemonicVault,
  getPrivateKeyOfAccountInChain,
  addChain,
} as const;

export default methods;
