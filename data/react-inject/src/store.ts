import { atom, createStore } from 'jotai';
import { unwrap } from 'jotai/utils';
import { type Database } from '@repo/database/src';
import { type INTERNAL_PrdStore } from 'jotai/vanilla/store';

export const store = createStore() as INTERNAL_PrdStore;
export type StoreType = ReturnType<typeof createStore>;
export { Provider } from 'jotai';
const asyncDatabaseAtom = atom<Promise<Database>>(new Promise<Database>(() => {}));
export const databaseAtom = unwrap(asyncDatabaseAtom);
export const inject = (dbPromise: Promise<Database>) => store.set(asyncDatabaseAtom, dbPromise);
