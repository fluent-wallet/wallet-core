import { inject as _inject, ref, getCurrentScope, onScopeDispose, createApp, type Ref, type UnwrapRef } from 'vue'
import { type Database, type State } from '@cfx-kit/wallet-core-database/src';
import type { Observable } from 'rxjs'

export const useDatabase = () => _inject<Database>('wallet-core-database');
export const useState = () => _inject<State>('wallet-core-state');

type App = ReturnType<typeof createApp>
export const provider = (app: App, dbAndState: { database: Database, state: State }) => {
  app.provide('wallet-core-database', dbAndState.database);
  app.provide('wallet-core-state', dbAndState.state);
}

export interface UseObservableOptions<I> {
  onError?: (err: any) => void
  initialValue?: I | undefined
}

export function useObservable<H, I = undefined>(
  observable: Observable<H>,
  options?: UseObservableOptions<I | undefined>,
): Readonly<Ref<H | I>> {
  const value = ref<H | I | undefined>(options?.initialValue)
  const subscription = observable.subscribe({
    next: val => (value.value = (val as UnwrapRef<H>)),
    error: options?.onError,
  })
  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })
  return value as Readonly<Ref<H | I>>
}


function tryOnScopeDispose(fn: () => any) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}

