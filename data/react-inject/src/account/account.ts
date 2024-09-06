import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable } from 'jotai/utils';
import { databaseAtom } from '../store';
import { observeAccountsOfVault } from '@repo/observable/src/account/account';

export const accountsAtomFamilyOfVault = atomFamily((vaultValue: string | null) =>
  atomWithObservable((get) => observeAccountsOfVault(get(databaseAtom), vaultValue), {
    initialValue: null,
  }),
);

export const useAccountsOfVault = (vaultValue: string | null) => useAtomValue(accountsAtomFamilyOfVault(vaultValue));
