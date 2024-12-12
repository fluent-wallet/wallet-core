import { of, map, type Observable, switchMap } from 'rxjs';
import { type Database, type State } from '@cfx-kit/wallet-core-database/src';

export const observePasswordInitialized = (state: State | undefined) =>
  !state ? of(undefined) : (state.get$('encryptorContent') as Observable<string>).pipe(
    map((encryptorContent) => !!encryptorContent),
  );

export const observeCurrentAccount = (database: Database | undefined, state: State | undefined) =>
  !state || !database ? of(undefined) : state.get$('currentAccountId').pipe(
    switchMap((accountId) => !accountId ? of(null) : database.accounts.findOne(accountId).$),
  );

export const observeCurrentChain = (database: Database | undefined, state: State | undefined) =>
  !state || !database ? of(undefined) : state.get$(`currentChain'sId`).pipe(
    switchMap((chainId) => !chainId ? of(null) : database.chains.findOne(chainId).$),
  );
