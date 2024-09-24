import { getVaultsCountOfType } from './accountSystem/vault/basic';
import { addMnemonicVault, addPrivateKeyVault } from './accountSystem/vault/addVault';
import { deleteVault } from './accountSystem/vault/deleteVault';
import { getPrivateKeyOfAccountInChain } from './accountSystem/account/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';
import { addAccountOfMnemonicVault, addFirstAccountOfVaultPipleline } from './accountSystem/account/addAccount';
import { deleteAccountsOfVaultPipleline } from './accountSystem/vault/deleteVault';

const methods = {
  getVaultsCountOfType,
  addMnemonicVault,
  addPrivateKeyVault,
  addAccountOfMnemonicVault,
  deleteVault,
  getPrivateKeyOfAccountInChain,
  addChain,
} as const;


export const pipelines = {
  addFirstAccountOfVault: addFirstAccountOfVaultPipleline,
  deleteAccountsOfVault: deleteAccountsOfVaultPipleline,
} as const;

export default methods;
