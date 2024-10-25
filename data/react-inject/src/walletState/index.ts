import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { observePasswordInitialized, observeCurrentAccount, observeCurrentChain } from '@cfx-kit/wallet-core-observable/src';
import { stateAtom, databaseAtom } from '../store';

export const passwordInitializedAtom = atomWithObservable((get) => observePasswordInitialized(get(stateAtom)));
export const useIsPasswordInitialized = () => useAtomValue(passwordInitializedAtom);

export const currentAccountAtom = atomWithObservable((get) => observeCurrentAccount(get(databaseAtom), get(stateAtom)));
export const useCurrentAccount = () => useAtomValue(currentAccountAtom);

export const currentChainAtom = atomWithObservable((get) => observeCurrentChain(get(databaseAtom), get(stateAtom)));
export const useCurrentChain = () => useAtomValue(currentChainAtom);
