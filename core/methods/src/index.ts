export * from './accountSystem/vault/basic';
export * from './accountSystem/vault/addVault';
export * from './accountSystem/vault/deleteVault';
export * from './accountSystem/account/getPrivateKeyOfAccountInChain';
export * from './chain/addChain';
import { addFirstAccountOfVaultPipleline } from './accountSystem/account/addAccount';
import { deleteAccountsOfVaultPipleline } from './accountSystem/vault/deleteVault';


export const pipelines = {
  addFirstAccountOfVault: addFirstAccountOfVaultPipleline,
  deleteAccountsOfVault: deleteAccountsOfVaultPipleline,
} as const;
