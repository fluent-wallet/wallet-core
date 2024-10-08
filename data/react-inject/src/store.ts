import { atom, createStore } from 'jotai';
import { unwrap } from 'jotai/utils';
import { type INTERNAL_PrdStore } from 'jotai/vanilla/store';
import { type Database, type State, type Data } from '@cfx-kit/wallet-core-database/src';

export const store = createStore() as INTERNAL_PrdStore;
export type StoreType = ReturnType<typeof createStore>;
export { Provider } from 'jotai';
const asyncDatabaseAtom = atom<Promise<Database>>(new Promise<Database>(() => { }));
export const databaseAtom = unwrap(asyncDatabaseAtom);
const asyncStateAtom = atom<Promise<State>>(new Promise<State>(() => { }));
export const stateAtom = unwrap(asyncStateAtom);

export const inject = (dataPromise: Promise<Data>) => {
  store.set(asyncDatabaseAtom, dataPromise.then(data => data.database));
  store.set(asyncStateAtom, dataPromise.then(data => data.state));
}
