# data

::: tip NOTE
data-inject 对应源码位于 `data/{framework}-inject` 目录下，对应的 npm包 为 `@cfx-kit/wallet-core-{framework}-inject`。
使用什么框架，就安装对应的 inject 包。
:::

如上篇 [数据与使用](./data-and-usage.md) 所述，我们提供了几种热门框架的 **hooks-style** 的 **inject** 实现以响应式的使用数据。

我们强烈建议在完成 [WalletClass instance(Database)](./wallet-class.md) 初始化后，紧接着完成 **data-inject**，而后再进行 framework 的 **Mount操作**。往下看可以发现，**hooks-style** 的 API，会在 database 未注入时返回 undefined。以这种方式 mount，可以简单得实现在 UI层 使用 hooks 时大胆进行非空断言如 `useVaults()!`, 不用担心数据为空。

[WalletClass instance](./wallet-class.md) 的初始化过程很短几乎不可感知，不用担心白屏问题。如果发现白屏时间过长，可以考虑 **mount & loading** 在先，**data-inject** 在后的方式。


初始化方式如下: 

::: tabs key:framework
== React
```typescript
// in main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { inject, store, Provider } from '@cfx-kit/wallet-core-react-inject';
import wallet from './wallet';

/**
 * recommend mount after wallet instance(database) init.
 */
wallet.initPromise.then((dbAndState) => {
  inject(dbAndState);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <Router />
      </Provider>
    </StrictMode>,
  );
});

/**
 * if you want to mount before wallet instance(database) init,
 * you can use this code.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

wallet.initPromise.then((dbAndState) => {
  inject(dbAndState);
});
```
==

== Vue3
```typescript
// in main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { provider } from '@cfx-kit/wallet-core-vue-inject';
import wallet from './wallet';

// must use pinia
const pinia = createPinia()
const app = createApp(App);
app.use(pinia);

/**
 * recommend mount after wallet instance(database) init.
 */
wallet.initPromise.then((dbAndState) => {
  provider(app, dbAndState);

  app.mount('#app');
});

/**
 * if you want to mount before wallet instance(database) init,
 * you can use this code.
 */
app.mount('#app');
wallet.initPromise.then((dbAndState) => {
  provider(app, dbAndState);
});
```
==

== Svelte
```typescript
没写
```
==
:::


完成初始化后，你可以在 UI 中使用以下提到的 **hooks-style** 的 api，来响应式的使用数据:

::: tabs key:framework
== React
```typescript
import { useVaults } from '@cfx-kit/wallet-core-react-inject';

const App: React.FC = () => {
  const vaults = useVaults();
  return <p>valuts length: {Array.isArray(vaults) ? vaults?.length : -1}</p>
}
```
==

== Vue3
```typescript
<script setup lang="ts">
import { useVaults } from '@cfx-kit/wallet-core-vue-inject';
const vaults = useVaults();
</script>

<template>
  <p>valuts length: {{ Array.isArray(vaults) ? vaults?.length : -1 }}</p>
</template>
```
==

== Svelte
```typescript
没写
```
==
:::


<br/>
<br/>


# 账户体系

## useVaults

- 类型：`() => Array<VaultDocType> | undefined`

- 说明：返回所有 vaults。当数据库未初始化时，返回 undefined。

- 对应 observable 函数:

`const observeVaults: (database: Database | undefined) => Observable<Array<VaultDocType> | undefined>`


## useVaultsCount

- 类型：`() => number | undefined`

- 说明：

  返回所有 vaults 的数量。当数据库未初始化时，返回 undefined。

- 对应 observable 函数:

`const observeVaultCount: (database: Database | undefined) => Observable<number | undefined>`

## useVaultFromId

- 类型：`(vaultId: string | null | undefined) => VaultDocType | undefined`

- 说明：返回指定 vaultId 的 vault; 
  + 当数据库未初始化，或 vaultId 为 null | undefined 时，返回 undefined;
  + 当 vaultId 有值且对应的 vault 不存在时，返回 null。

- 对应 observable 函数:

`const observeVaultById: (database: Database | undefined, vaultId: string | null | undefined) => Observable<VaultDocType | undefined>`

## useAllAccountsOfVault

- 类型：`(vaultId: string | null | undefined) => Array<AccountDocType> | undefined`

- 说明：返回指定 vaultId 的所有账户， 包含被**隐藏**的助记词子账户。当数据库未初始化时，返回 undefined。
  + 当数据库未初始化，或 vaultId 为 null | undefined 时，返回 undefined;
  + 当 vaultId 有值且对应的 vault 不存在，或者 对应 vault 存在但是 accounts 为空时，返回 null。

- 对应 observable 函数:

`const observeAccountsOfVault: (database: Database | undefined, vaultId: string | null | undefined) => Observable<Array<AccountDocType> | undefined>`

## useAccountsOfVault

- 类型：`(vaultId: string | null | undefined) => Array<AccountDocType> | undefined`

- 说明：返回指定 vaultId 的所有账户， 不包含被**隐藏**的助记词子账户。

- 对应 observable 函数: 同上 `observeAccountsOfVault`

<br/>
<br/>
<br/>
<br/>

# 链

<br/>
<br/>
<br/>
<br/>

# 资产

<br/>
<br/>
<br/>
<br/>

# 交易记录

<br/>
<br/>
<br/>
<br/>

# 交易状态

<br/>
<br/>
<br/>
<br/>


# 钱包状态

## useIsPasswordInitialized

- 类型：`() => boolean | undefined`

- 说明：返回是否已初始化密码。当数据库未初始化时，返回 undefined。

- 对应 observable 函数:

`const observePasswordInitialized: (database: Database | undefined) => Observable<boolean | undefined>`

## useCurrentAccount

- 类型：`() => AccountDocType | null | undefined`

- 说明：返回当前账户。默认情况下不设置当前账户的概念。
  + 当数据库未初始化时，返回 undefined;
  + 未设置当前账户 或者 设置的 当前账户id 不存在时，返回 null;
  
- 对应 observable 函数:

`const observeCurrentAccount: (database: Database | undefined, state: State | undefined) => Observable<AccountDocType | null | undefined>`


## useCurrentChain

- 类型：`() => ChainDocType | null | undefined`

- 说明：返回当前链。
  + 当数据库未初始化时，返回 undefined;
  + 未设置当前链 或者 设置的 当前链id 不存在时，返回 null;

- 对应 observable 函数:

`const observeCurrentChain: (database: Database | undefined, state: State | undefined) => Observable<ChainDocType | null | undefined>`