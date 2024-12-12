# UI层 怎么使用 database 中的数据？

此篇可略过，讲的是概念性的东西，可以直接往下看 [数据API](./data-api.md)。

rxdb 提供了 **observable** 的机制，可以方便的将数据库中的数据转换为 observable 流，详情见 [RxQuery](https://rxdb.info/rx-query.html) 与 [RxState](https://rxdb.info/rx-state.html)。

WalletCore 提供了 `@cfx-kit/wallet-core-observable`，其中提供了对 database中所有数据进行 observe 的方法，这些方法会产生对数据的 observable 对象。

基于这些方法，WalletCore进一步提供了 `@cfx-kit/wallet-core-(framework)-inject` 的封装，能够以 **hooks-style** 的方式直接在框架中响应式得使用 database 中的数据。

所以两者拥有一致的文件结构，都是按数据的类型组织的。同一个位置的文件里，**inject** 是对 **observable** 的调用封装。

<br />

一般来讲，observe方法 有两类，一类是 直接对数据 observe，另一类是 对关联数据 observe。

::: tabs 

== 直接对数据进行 observe

```typescript
import { map, of } from 'rxjs';
import { type Database } from '@cfx-kit/wallet-core-database';

const observeVaults = (database: Database | undefined) =>
  !database ? of(undefined) :
    database.vaults.find({ sort: [{ createAt: 'asc' }] }).$.pipe(
      map((vaults) => vaults.map((vault) => vault.toJSON()))
    );
```

== 对关联数据 observe

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

相应的， inject 中也有对应这两类 observe方法 的 hooks 函数。

这里以 `@cfx-kit/wallet-core-react-inject` 为例，它基于 [jotai](https://jotai.org/) 实现。

::: tabs 

== 直接数据

```typescript
import { useAtomValue } from 'jotai';
import { atomFamily, atomWithObservable } from 'jotai/utils';
import { observeVaults } from '@cfx-kit/wallet-core-observable/src';
import { databaseAtom } from '../store';

export const vaultsAtom = atomWithObservable((get) => observeVaults(get(databaseAtom)));

export const useVaults = () => useAtomValue(vaultsAtom);
```

== 关联数据

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

如果不满意官方提供的 inject 方案，或者需要支持其他的前端框架，可以自己基于 @cfx-kit/wallet-core-observable 实现一套 inject 机制。