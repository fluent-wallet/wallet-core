import { defineStore, storeToRefs } from 'pinia';
import { useDatabase, useObservable } from '../store';
import { observeAccountsOfVault } from '@cfx-kit/wallet-core-observable/src/account/account';

const useAccountsOfVaultStore = (vaultValue: string | null) => defineStore('wallet-core-accountsOfVault', () => {
  const database = useDatabase();
  const accounts = useObservable(observeAccountsOfVault(database, vaultValue));
  return { accounts }
})();


export const useAccountsOfVault = (vaultValue: string | null) => storeToRefs(useAccountsOfVaultStore(vaultValue)).accounts;