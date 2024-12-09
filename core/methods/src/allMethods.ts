import { getVaultsCountOfType, updateVault } from './accountSystem/vault/basic';
import { addMnemonicVault, addPrivateKeyVault } from './accountSystem/vault/addVault';
import { deleteVault } from './accountSystem/vault/deleteVault';
import { getPrivateKeyOfAccountInChain } from './accountSystem/account/getPrivateKeyOfAccountInChain';
import { addChain } from './chain/addChain';
import { addAccountOfMnemonicVault } from './accountSystem/account/addAccount';
import { updateAccount, getVaultOfAccount } from './accountSystem/account/basic';
import { deleteAccount } from './accountSystem/account/deleteAccount';
import { addAddressOfChainPipeline, addAddressOfAccountPipeline, deleteAddressOfChainPipeline, deleteAddressOfAccountPipeline } from './address/addAddressPipeline';
import { vaultToAccountPipeline } from './accountSystem/vault/pipeline';
import { setCurrentAccount, setCurrentChain } from './walletState';

const methods = {
  addMnemonicVault,
  addPrivateKeyVault,
  addAccountOfMnemonicVault,
  deleteVault,
  updateVault,
  getVaultsCountOfType,
  updateAccount,
  deleteAccount,
  getPrivateKeyOfAccountInChain,
  getVaultOfAccount,
  addChain,
  setCurrentAccount,
  setCurrentChain,
} as const;

export const pipelines = {
  vaultToAccount: vaultToAccountPipeline,
  addAddressOfChain: addAddressOfChainPipeline,
  addAddressOfAccount: addAddressOfAccountPipeline,
  deleteAddressOfChain: deleteAddressOfChainPipeline,
  deleteAddressOfAccount: deleteAddressOfAccountPipeline,
} as const;

export default methods;
