import { of, map, switchMap, type Observable, tap } from 'rxjs';
import { type Database, type RxDocument } from '@cfx-kit/wallet-core-database/src';
import { type AccountDocType } from '@cfx-kit/wallet-core-database/src/models/Account';

export const observeAccountsOfVault1 = (database: Database | undefined, vaultId: string | null) => {
  if (!database || !vaultId) return of(undefined);
  return database.vaults.findOne(vaultId).$.pipe(
    switchMap((vault) => {
      if (!vault) return of(null);
      return (vault as any).accounts_ as Observable<Array<RxDocument<AccountDocType>>>;
    }),
    map((accounts) => !accounts ? null : accounts.map((account) => account.toJSON()))
  );
};

export const observeAccountsOfVault2 = (database: Database | undefined, vaultId: string | null) => {
  if (!database || !vaultId) return of(undefined);
  return database.accounts
    .find({
      selector: {
        vault: vaultId,
      },
      sort: [{ createAt: 'asc' }],
    })
    .$.pipe(
      map((accounts) => (!accounts || !accounts.length ? null : accounts.map((account) => account.toJSON())))
    );
};


export const observeAccountsOfVault = observeAccountsOfVault1;
