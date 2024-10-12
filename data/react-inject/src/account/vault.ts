import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable } from 'jotai/utils';
import { observeVaults, observeVaultCount, observeVaultById } from '@cfx-kit/wallet-core-observable/src';
import { databaseAtom } from '../store';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));
export const useVaults = () => useAtomValue(vaultsAtom);

export const vaultsCountAtom = atomWithObservable((get) => observeVaultCount(get(databaseAtom)));
export const useVaultsCount = () => useAtomValue(vaultsCountAtom);

const vaultAtomFromId = atomFamily((vaultId: string | null | undefined) =>
  atomWithObservable((get) => observeVaultById(get(databaseAtom), vaultId), { initialValue: null! }),
);
export const useVaultFromId = (vaultId: string | null | undefined) => useAtomValue(vaultAtomFromId(vaultId));