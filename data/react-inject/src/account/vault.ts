import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { databaseAtom } from '../store';
import { observeVaults } from '@cfx-kit/wallet-core-observable/src';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));
export const useVaults = () => useAtomValue(vaultsAtom);
