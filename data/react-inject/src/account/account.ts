import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable, selectAtom } from 'jotai/utils';
import { databaseAtom } from '../store';
import { observeAccountsOfVault } from '@cfx-kit/wallet-core-observable/src';

export const accountsAtomFamilyOfVault = atomFamily((vaultId: string | null) =>
  atomWithObservable((get) => observeAccountsOfVault(get(databaseAtom), vaultId), {
    initialValue: null,
  }),
);

export const visibleAccountsAtomFamilyOfVault = atomFamily((vaultId: string | null) =>
  selectAtom(accountsAtomFamilyOfVault(vaultId), (accounts) =>
    accounts ? accounts.filter(account => !account.hidden) : accounts
  )
);

export const useAllAccountsOfVault = (vaultId: string | null) => useAtomValue(accountsAtomFamilyOfVault(vaultId));
export const useAccountsOfVault = (vaultId: string | null) => useAtomValue(visibleAccountsAtomFamilyOfVault(vaultId));