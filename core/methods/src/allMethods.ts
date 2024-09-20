import { getVaultsCountOfType } from './accountSystem/vault/basic';
import { addMnemonicVault, addPrivateKeyVault } from './accountSystem/vault/addVault';
import { deleteVault } from './accountSystem/vault/deleteVault';
import { getPrivateKeyOfAccountInChain } from './accountSystem/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';

const methods = {
  getVaultsCountOfType,
  addMnemonicVault,
  addPrivateKeyVault,
  deleteVault,
  getPrivateKeyOfAccountInChain,
  addChain,
} as const;

export default methods;
