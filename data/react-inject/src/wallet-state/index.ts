import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { observePasswordInitialized } from '@cfx-kit/wallet-core-observable/src';
import { stateAtom } from '../store';

export const passwordInitializedAtom = atomWithObservable((get) => observePasswordInitialized(get(stateAtom)));
export const useIsPasswordInitialized = () => useAtomValue(passwordInitializedAtom);
