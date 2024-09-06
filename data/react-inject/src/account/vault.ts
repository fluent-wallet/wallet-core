import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { databaseAtom } from '../store';
import { observeVaults } from '@repo/observable/src/account/vault';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));
export const useVaults = () => useAtomValue(vaultsAtom);
