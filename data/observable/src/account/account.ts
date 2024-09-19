import { of, map } from 'rxjs';
import { type Database } from '@cfx-kit/wallet-core-database/src';

export const observeAccountsOfVault = (database: Database | undefined, vaultId: string | null) => {
  if (!database || !vaultId) return of(undefined);
  return database.accounts
    .find({
      selector: {
        vault: vaultId,
      },
      sort: [{ createAt: 'asc' }],
    })
    .$.pipe(map((accounts) => (!accounts || !accounts.length ? null : accounts.map((account) => account.toJSON()))));
};
