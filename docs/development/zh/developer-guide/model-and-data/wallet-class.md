# Wallet

::: tip NOTE
WalletClass 对应源码位于 `core/wallet` 目录下，对应的 npm包 为 `@cfx-kit/wallet-core-wallet`。
WalletClass 的实例 是你 配置钱包参数，使用钱包方法的入口。
:::

`@cfx-kit/wallet-core-wallet` 会导出 [database](./database.md) 中提到的 **类型与枚举值**。
并且提供了一系列钱包机制相关的插件，比如用来加密 `Vault` 的 `Encryptor`、用以配合加解密的 `Password` 机制、Wallet-Connect接入、Provider注入、RPC响应、硬件钱包接入 等等。

```typescript
import WalletClass, {
  type Database,
  type State,
  type VaultDocType,
  type VaultSourceType
  VaultSourceEnum,
} from '@cfx-kit/wallet-core-wallet';
import Encryptor from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor';
import MemoryPassword from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor/Password/MemoryPassword';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

export const memoryPassword = new MemoryPassword();

export const wallet = new WalletClass<typeof myMethods>({
  methods,
  chains,
  databaseOptions: {
    storage: getRxStorageDexie(),
    encryptor: new Encryptor(memoryPassword.getPassword.bind(memoryPassword)),
  },
});

```

<br />
<br />

# constructor 参数

## databaseOptions

- 类型：`{ storage: RxStorage; dbName?: string; encryptor?: Encryptor; }`

- 说明：
  + storage 是 [RxDB的存储层](https://rxdb.info/rx-storage.html)，详情见[各端存储层选择和差异点](../)。
  + dbName 是数据库的名称，默认值为 'wallet-core'。
  + encryptor 是 vault 中 助记词私钥 等私密数据的加密器，详情见 [Encryptor](../encryptor.md)。

## methods

- 类型：
```typescript
type MethodsWithDatabase<T extends MethodsMap> = {
  [K in keyof T]: MethodWithDatabaseAndState<any>;
};

class WalletClass<T extends MethodsMap = any> {
  methods: { [K in keyof T]: RemoveFirstArg<T[K]> };
}
```

- 说明：
  **WalletClass** 接受 constructor 参数中的 **methods** 参数时，会将其内所有方法柯里化，将第一个参数注入 **database&state** 实例，返回去掉第一个参数后的方法。详情请回看 [methods-api](./methods-api.md)。

## chains

- 类型：`type ChainsMap = Record<string, ChainMethods>`

- 说明：
  **WalletClass** 接收 constructor 参数中的 **chains** 参数，将其设置为 **chains** 属性，不做任何处理。详情请回看见 [链的抽象与 API](../chain-abstract-api.md)。

## extensionType

- 类型：`'background' | 'popup' | 'content'`

- 说明：
  + extensionType 为 popup / content 时，methods 里的函数被替换为发送对应名字和参数的通讯方法;
  + extensionType 为 background 时，methods 里的函数被修改为接收 popup / content 发来的通讯，并执行对应方法。
  + 这个属性是 插件钱包 专属属性，用来保证**写入数据库**只发生在 background 进程中。(当然，其实写入在 popup 和 content 中也是可以的。当你需要保证 ui 线程不阻塞，或者对多处写入有担心时，可以考虑使用这个属性)

<br />
<br />

# 插件

## WalletConnect

## Provider注入

## RPC响应

## 权限管理

## 硬件钱包