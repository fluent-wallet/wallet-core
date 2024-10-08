export * from './accountSystem/vault/basic';
export * from './accountSystem/vault/addVault';
export * from './accountSystem/vault/deleteVault';
export * from './accountSystem/account/getPrivateKeyOfAccountInChain';
export * from './chain/addChain';
export * from './accountSystem/account/deleteAccount';
export * from './accountSystem/account/basic';
import { addFirstAccountOfVaultPipleline } from './accountSystem/account/addAccount';
import { deleteAccountsOfVaultPipleline } from './accountSystem/vault/deleteVault';
import { addAddressOfChainPipleline, addAddressOfAccountPipleline } from './address/addAddressPipeline';


export const pipelines = {
  addFirstAccountOfVault: addFirstAccountOfVaultPipleline,
  deleteAccountsOfVault: deleteAccountsOfVaultPipleline,
  addAddressOfChain: addAddressOfChainPipleline,
  addAddressOfAccount: addAddressOfAccountPipleline,
} as const;
