export * from './accountSystem/vault/basic';
export * from './accountSystem/vault/addVault';
export * from './accountSystem/vault/deleteVault';
export * from './accountSystem/account/getPrivateKeyOfAccountInChain';
export * from './chain/addChain';
export * from './accountSystem/account/deleteAccount';
export * from './accountSystem/account/basic';
import { vaultToAccountPipeline } from './accountSystem/vault/pipeline';
import { addAddressOfChainPipeline, addAddressOfAccountPipeline, deleteAddressOfChainPipeline, deleteAddressOfAccountPipeline } from './address/addAddressPipeline';


export const pipelines = {
  vaultToAccount: vaultToAccountPipeline,
  addAddressOfChain: addAddressOfChainPipeline,
  addAddressOfAccount: addAddressOfAccountPipeline,
  deleteAddressOfChain: deleteAddressOfChainPipeline,
  deleteAddressOfAccount: deleteAddressOfAccountPipeline,
} as const;
