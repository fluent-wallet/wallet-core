import { of, map } from 'rxjs';
import { type Database } from '@cfx-kit/wallet-core-database/src';

export const observeAccountsOfVault = (database: Database | undefined, vaultValue: string | null) => {
  if (!database || !vaultValue) return of(undefined);
  return database.accounts
    .find({
      selector: {
        vault: vaultValue,
      },
      sort: [{ createAt: 'asc' }],
    })
    .$.pipe(map((accounts) => (!accounts || !accounts.length ? null : accounts.map((account) => account.toJSON()))));
};
