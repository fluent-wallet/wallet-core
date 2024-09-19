import { defineStore, storeToRefs } from 'pinia';
import { useDatabase, useObservable } from '../store';
import { observeAccountsOfVault } from '@cfx-kit/wallet-core-observable/src/account/account';

const useAccountsOfVaultStore = (vaultId: string | null) => defineStore('wallet-core-accountsOfVault', () => {
  const database = useDatabase();
  const accounts = useObservable(observeAccountsOfVault(database, vaultId));
  return { accounts }
})();


export const useAccountsOfVault = (vaultId: string | null) => storeToRefs(useAccountsOfVaultStore(vaultId)).accounts;