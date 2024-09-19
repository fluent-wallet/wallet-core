import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable } from 'jotai/utils';
import { databaseAtom } from '../store';
import { observeAccountsOfVault } from '@cfx-kit/wallet-core-observable/src/account/account';

export const accountsAtomFamilyOfVault = atomFamily((vaultId: string | null) =>
  atomWithObservable((get) => observeAccountsOfVault(get(databaseAtom), vaultId), {
    initialValue: null,
  }),
);

export const useAccountsOfVault = (vaultId: string | null) => useAtomValue(accountsAtomFamilyOfVault(vaultId));
