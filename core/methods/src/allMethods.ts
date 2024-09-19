import { getVaultsCountOfType } from './accountSystem/vault/basic';
import { addMnemonicVault } from './accountSystem/vault/addVault';
import { deleteVault } from './accountSystem/vault/deleteVault';
import { getPrivateKeyOfAccountInChain } from './accountSystem/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';

const methods = {
  getVaultsCountOfType,
  addMnemonicVault,
  deleteVault,
  getPrivateKeyOfAccountInChain,
  addChain,
} as const;

export default methods;
