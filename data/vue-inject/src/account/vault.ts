import { defineStore, storeToRefs } from 'pinia';
import { useDatabase, useObservable } from '../store';
import { observeVaults } from '@cfx-kit/wallet-core-observable/src/account/vault';

const useVaultStore = defineStore('wallet-core-vaults', () => {
    const database = useDatabase();
    const vaults = useObservable(observeVaults(database));
    return { vaults }
});


export const useVaults = () => storeToRefs(useVaultStore()).vaults;