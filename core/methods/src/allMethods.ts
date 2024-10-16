import { getVaultsCountOfType, updateVault } from './accountSystem/vault/basic';
import { addMnemonicVault, addPrivateKeyVault } from './accountSystem/vault/addVault';
import { deleteVault } from './accountSystem/vault/deleteVault';
import { getPrivateKeyOfAccountInChain } from './accountSystem/account/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';
import { addAccountOfMnemonicVault, addFirstAccountOfVaultPipleline } from './accountSystem/account/addAccount';
import { updateAccount, getVaultOfAccount } from './accountSystem/account/basic';
import { deleteAccount } from './accountSystem/account/deleteAccount';
import { deleteAccountsOfVaultPipleline } from './accountSystem/vault/deleteVault';
import { addAddressOfChainPipleline, addAddressOfAccountPipleline, deleteAddressOfChainPipleline, deleteAddressOfAccountPipleline } from './address/addAddressPipeline';

const methods = {
  getVaultsCountOfType,
  addMnemonicVault,
  addPrivateKeyVault,
  addAccountOfMnemonicVault,
  deleteVault,
  getPrivateKeyOfAccountInChain,
  addChain,
  updateAccount,
  deleteAccount,
  updateVault,
  getVaultOfAccount
} as const;


export const pipelines = {
  addFirstAccountOfVault: addFirstAccountOfVaultPipleline,
  deleteAccountsOfVault: deleteAccountsOfVaultPipleline,
  addAddressOfChain: addAddressOfChainPipleline,
  addAddressOfAccount: addAddressOfAccountPipleline,
  deleteAddressOfChain: deleteAddressOfChainPipleline,
  deleteAddressOfAccount: deleteAddressOfAccountPipleline,
} as const;


export default methods;
