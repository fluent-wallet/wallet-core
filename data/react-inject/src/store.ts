import { atom, createStore } from 'jotai';
import { type INTERNAL_PrdStore } from 'jotai/vanilla/store';
import { type Database, type State } from '@cfx-kit/wallet-core-database/src';


export const store = createStore() as INTERNAL_PrdStore;
export type StoreType = ReturnType<typeof createStore>;
export { Provider } from 'jotai';

export const databaseAtom = atom<Database | undefined>(undefined);
export const stateAtom = atom<State | undefined>(undefined);

export const inject = (dbAndState: { database: Database, state: State }) => {
  store.set(databaseAtom, dbAndState.database);
  store.set(stateAtom, dbAndState.state);
}