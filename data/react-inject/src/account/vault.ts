import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { observeVaults } from '@cfx-kit/wallet-core-observable/src';
import { databaseAtom } from '../store';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));
export const useVaults = () => useAtomValue(vaultsAtom);
