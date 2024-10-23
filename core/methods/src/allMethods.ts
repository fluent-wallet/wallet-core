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
  getVaultOfAccount,
} as const;

export const pipelines = {
  vaultToAccount: vaultToAccountPipeline,
  addAddressOfChain: addAddressOfChainPipeline,
  addAddressOfAccount: addAddressOfAccountPipeline,
  deleteAddressOfChain: deleteAddressOfChainPipeline,
  deleteAddressOfAccount: deleteAddressOfAccountPipeline,
} as const;

export default methods;
