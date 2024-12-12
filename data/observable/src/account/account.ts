import { of, from, map, switchMap, concatMap, bufferCount, mergeMap, combineLatest } from 'rxjs';
import { type Database, type RxDocument } from '@cfx-kit/wallet-core-database/src';
import { type AccountDocType } from '@cfx-kit/wallet-core-database/src/models/Account';

const BATCH_SIZE = 128; // Set the batch processing size
const CONCURRENCY = 16; // Set the maximum concurrency

export const observeAccountsOfVault = (database: Database | undefined, vaultId: string | null | undefined) => {
  if (!database || !vaultId) return of(undefined);
  return database.vaults.findOne(vaultId).$.pipe(
    switchMap((vault) => {
      if (!vault || !vault.accounts$) return of(null);
      return from(vault.populate('accounts') as Promise<Array<RxDocument<AccountDocType>>>);
    }),
    switchMap((accounts) => {
      if (!accounts) return of(null);
      return from(accounts).pipe(
        bufferCount(BATCH_SIZE),
        concatMap(batch =>
          combineLatest(batch.map(accountDoc => accountDoc.$).map(observable =>
            from(observable).pipe(mergeMap(data => of(data), CONCURRENCY))
          ))
        ),
        map(accountsData =>
          !accountsData ? null : accountsData.map(account => account.toJSON())
        )
      );
    }),
  );
};
