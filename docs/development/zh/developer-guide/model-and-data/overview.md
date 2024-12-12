# 概述

面向开发者的 WalletCore 可以分成四个部分: 
- [WalletClass](./wallet-class.md) (包含了依赖项 - [database](./database-model.md))。
  + [WalletClass](./wallet-class.md)  的实例是 **配置、使用** WalletCore 的入口。
  + [database](./database-model.md) 是 数据库定义，是 `WalletClass` 的依赖，并不会直接使用到。
- [methods](./methods-api.md) 钱包相关的方法。在 WalletClass 中 完成 database实例 的柯里化注入。
- [chains](./chain-abstract-api.md) 各个链的标准化方法，为 [methods](./methods-api.md) 提供数据最后写入 database实例。
- [data](./data-and-usage.md) (包含 `data-observable` 和 `framework-inject`)。能以 **hooks-style** 的方式响应式地在 ui 中使用钱包数据。

它们的目录结构如下: 

```
.
│─ core
│  ├─ database (npm包 `@cfx-kit/wallet-core-database`)
│  ├─ wallet   (即上述 WalletClass, npm包 `@cfx-kit/wallet-core-wallet`) 
│  ├─ methods  (npm包 `@cfx-kit/wallet-core-methods`)
├─ chains
│  ├─ evm (npm包 `@cfx-kit/wallet-core-chains-evm`)
│  ├─ solana (npm包 `@cfx-kit/wallet-core-chains-solana`)
│  ├─ ...
├─ data
│  ├─ data-observable (npm包 `@cfx-kit/wallet-core-data-observable`)
│  ├─ react-inject (npm包 `@cfx-kit/wallet-core-react-inject`)
│  ├─ vue3-inject (npm包 `@cfx-kit/wallet-core-vue3-inject`)
│  ├─ ...
└─
```

