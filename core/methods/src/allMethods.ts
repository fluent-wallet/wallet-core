import { addMnemonicVault } from './accountSystem/vault/addVault';
import { getPrivateKeyOfAccountInChain } from './accountSystem/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';

const methods = {
  addMnemonicVault,
  getPrivateKeyOfAccountInChain,
  addChain,
} as const;

export default methods;
