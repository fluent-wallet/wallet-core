import { addMnemonicVault } from './account/mnemonic/addMnemonicVault';
import { addChain } from './chain/addChain';

const methods = {
  addMnemonicVault,
  addChain,
} as const;

export default methods;
