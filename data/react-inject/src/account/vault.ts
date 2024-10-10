import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { observeVaults, observeVaultCount } from '@cfx-kit/wallet-core-observable/src';
import { databaseAtom } from '../store';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));
export const useVaults = () => useAtomValue(vaultsAtom);

export const vaultsCountAtom = atomWithObservable((get) => observeVaultCount(get(databaseAtom)));
export const useVaultsCount = () => useAtomValue(vaultsCountAtom);
