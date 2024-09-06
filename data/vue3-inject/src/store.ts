import { inject, ref, getCurrentScope, onScopeDispose, createApp, type Ref, type UnwrapRef } from 'vue'
import { type Database } from '@repo/database/src';
import type { Observable } from 'rxjs'

export const useDatabase = () => inject<Database>('wallet-core-database');

type App = ReturnType<typeof createApp>
export const createInject = (app: App) => (database: Database) => app.provide('wallet-core-database', database);

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

