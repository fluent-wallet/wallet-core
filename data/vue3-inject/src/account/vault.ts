import { defineStore } from 'pinia';
import { useDatabase, useObservable } from '../store';
import { observeVaults } from '@repo/observable/src/account/vault';

export const useVaultsStore = defineStore('wallet-core-vaults', () => {
    const database = useDatabase();
    const vaults = useObservable(observeVaults(database));
    return { vaults }
});
