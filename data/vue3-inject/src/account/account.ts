import { defineStore } from 'pinia';
import { useDatabase, useObservable } from '../store';
import { observeAccountsOfVault } from '@repo/observable/src/account/account';

export const useAccountsOfVaultStore = (vaultValue: string | null) => defineStore('wallet-core-accountsOfVault', () => {
  const database = useDatabase();
  const accounts = useObservable(observeAccountsOfVault(database, vaultValue));
  return { accounts }
})();