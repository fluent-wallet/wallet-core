## How to Use Data from the Database in the UI Layer?

This section can be skipped as it discusses conceptual matters. For direct usage, please refer to the next section on [Data API](./data-api.md).

RxDB provides an observable mechanism that conveniently converts data from the database into observable streams. For more details, see [RxQuery](https://rxdb.info/rx-query.html) and [RxState](https://rxdb.info/rx-state.html).

WalletCore offers @cfx-kit/wallet-core-observable, which provides methods to observe all data in the database, resulting in observable objects for the data.

Based on these methods, WalletCore further provides a wrapper for @cfx-kit/wallet-core-(framework)-inject, allowing for a hooks-style way to reactively use data from the database directly within the framework.

Thus, both have a consistent file structure, organized by data type. The inject in the same location is a wrapper for the observe call.

<br />

Generally speaking, there are two types of observe methods: one for directly observing data and another for observing related data.

::: tabs 

== Directly Observing Data

```typescript
import { map, of } from 'rxjs';
import { type Database } from '@cfx-kit/wallet-core-database';

const observeVaults = (database: Database | undefined) =>
  !database ? of(undefined) :
    database.vaults.find({ sort: [{ createAt: 'asc' }] }).$.pipe(
      map((vaults) => vaults.map((vault) => vault.toJSON()))
    );
```

== Observing Related Data

```typescript
import { of, from, map, switchMap } from 'rxjs';
import { type Database, type RxDocument, type AccountDocType } from '@cfx-kit/wallet-core-database';

export const observeAccountsOfVault = (database: Database | undefined, vaultId: string | null) => {
  if (!database || !vaultId) return of(undefined);
  
  return database.vaults.findOne(vaultId).$.pipe(
    switchMap((vault) => {
      if (!vault || !vault.accounts$) return of(null);
      return from(vault.populate('accounts') as Promise<Array<RxDocument<AccountDocType>>>);
    }),
    map((accounts) => {
      if (!accounts) return null;
      return accounts.map(account => account.toJSON());
    })
  );
};
```
:::

<br />

Correspondingly, the inject also has hook functions for these two types of observe methods.

Taking @cfx-kit/wallet-core-react-inject as an example, it is implemented based on [jotai](https://jotai.org/).

::: tabs 

== Direct Data

```typescript
import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable } from 'jotai/utils';
import { observeVaults } from '@cfx-kit/wallet-core-observable/src';
import { databaseAtom } from '../store';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));

export const useVaults = () => useAtomValue(vaultsAtom);
```

== Related Data

```typescript
import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable } from 'jotai/utils';
import { observeAccountsOfVault } from '@cfx-kit/wallet-core-observable';
import { databaseAtom } from '../store';

export const accountsAtomFamilyOfVault = atomFamily((vaultId: string | null) =>
  atomWithObservable((get) => observeAccountsOfVault(get(databaseAtom), vaultId), {
    initialValue: null,
  }),
);

export const useAccountsOfVault = (vaultId: string | null) => useAtomValue(accountsAtomFamilyOfVault(vaultId));
```
:::

If you are not satisfied with the official inject solution or need to support other front-end frameworks, you can implement your own inject mechanism based on @cfx-kit/wallet-core-observable.