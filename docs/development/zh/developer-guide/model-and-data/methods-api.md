
# methods

::: tip NOTE
methods 对应源码位于 `core/methods` 目录下，对应的 npm包 为 `@cfx-kit/wallet-core-methods`。
你不能直接使用这个包中的方法，而是需要将其作为 [WalletClass instance](./wallet-class.md) 的参数 完成 database实例 的注入。开发过程中你只需要使用 [WalletClass instance](./wallet-class.md) 即可。
:::


methods 是 WalletCore 中与钱包相关的所有方法，这些方法会修改 [database](./database-model.md)实例 中的数据。

源码中的 methods 是如下这样子的，如果你需要自己实现一些方法，请遵循 **方法中的第一个参数是个接受 database 或者 state 的对象**。

``` typescript
type MethodWithDatabaseAndState<T> = ((dbAndState: { database: Database; state: State; }, ...args: any[]) => T) |
  ((dbAndState: { database: Database; }, ...args: any[]) => T) |
  ((dbAndState: { state: State; }, ...args: any[]) => T);

const addMnemonicVault: (dbAndState: { database: Database }, params?: MnemonicVaultParams) => Promise<RxDocument<VaultDocType>>;
const setCurrentAccount: (dbAndState: { state: State }, accountOrId: AccountDocType | string | null) => Promise<void>;
```

显然，**原始的 methods 并不能直接使用**，需要在 [WalletClass instance](./wallet-class.md) 中完成 database实例 的柯里化式注入，然后通过 `methods` 属性访问。柯里化后的 **wallet.methods** 即为原始 methods 去掉第一个参数后的集合。

如果想尽可能缩小包体积，可以单独导入需要的方法组成 **methods**，否则直接导入 **allMethods** 即可。请看下面的示例代码:

::: tabs
== wallet.ts
```typescript
import allMethods from '@cfx-kit/wallet-core-methods/dist/allMethods';
import { addMnemonicVault, addChain } from '@cfx-kit/wallet-core-methods';
import WalletClass,  { type Database, type State } from '@cfx-kit/wallet-core-wallet';

const xxxCustomMethod = ({ database }: { database: Database, state: State }) => {
  console.log('xxxCustomMethod');
}

const myMethods = {
  addMnemonicVault,
  addChain,
  xxxCustomMethod,
}

export const wallet = new WalletClass<typeof myMethods>({
  methods: allMethods, // myMethods
});

```
==

== somewhere-use.ts
```typescript
import { wallet } from '@wallet';

wallet.methods.xxxCustomMethod();

const App: React.FC = () => {

  return (
    <button onClick={() => {
      wallet.methods.addMnemonicVault()
    }}>
      add Random Mnemonic Vault
    </button>
  );
}
```
==
:::

<br/>
<br/>

# 账户体系

## addMnemonicVault

- 类型：
```typescript
export interface MnemonicVaultParams {
  name?: string;
  mnemonic?: string;
  source?: VaultSource; // "create" | "import"
  isBackup?: boolean;
}

const addMnemonicVault: (params?: MnemonicVaultParams) => Promise<RxDocument<VaultDocType>>
```

- 说明：增加一个 `type` 为 `mnemonic` 的 vault。
  + 默认 `mnemonic` 为随机生成的12位英文助记词。
  + 默认 `source` 为 `create`。
  + 默认 `isBackup` 为 在 `source` 为 `import` 时，为 `true`，否则为 `false`。
  + 默认 `name` 为 `Wallet ${generateDefaultVaultCode(index)}`，其中 `index` 为当前数据库中 `type` 为 `mnemonic` 的 vault 数量。

## addPrivateKeyVault

- 类型：
```typescript
export interface PrivateKeyVaultParams {
  name?: string;
  privateKey: string;
  source: VaultSource; // "create" | "import"
}

const addPrivateKeyVault: (params?: PrivateKeyVaultParams) => Promise<RxDocument<VaultDocType>>
```

- 说明：增加一个 `type` 为 `privateKey` 的 vault。
  + 默认 `name` 为 `Wallet ${generateDefaultVaultCode(index)}`，其中 `index` 为当前数据库中 `type` 为 `privateKey` 的 vault 数量。

## addAccountOfMnemonicVault

- 类型：
```typescript
interface AccountParams {
  name?: string;
}

const addAccountOfMnemonicVault: (vaultIdOrVault: string | VaultDocType | DeepReadonly<VaultDocType>, params?: AccountParams) => Promise<RxDocument<AccountDocType>>
```

- 说明：为一个 `mnemonic` 类型的 vault 增加一个 `Account`账户。
  + 默认 `name` 为 `Account ${hdIndex + 1}`，其中 `hdIndex` 为新增账户对应的 `hdIndex`。

## deleteVault

- 类型：
```typescript
const deleteVault: (vaultIdOrVault: string | VaultDocType) => Promise<VaultDocType>
```

- 说明：删除一个 vault。


## updateVault

- 类型：
```typescript
function updateVault({ database }: { database: Database }, vaultData: Partial<VaultDocType> & { id: string }): Promise<RxDocument<VaultDocType>>;
function updateVault({ database }: { database: Database }, vaultId: string, vaultData: Partial<VaultDocType>): Promise<RxDocument<VaultDocType>>;
```

- 说明：更新一个 vault。


## getVaultsCountOfType

- 类型：
```typescript
const getVaultsCountOfType: (type: VaultType) => Promise<number>
```

- 说明：获取指定类型的 vault 数量。

## updateAccount

- 类型：
```typescript
function updateAccount({ database }: { database: Database }, accountData: Partial<AccountDocType> & { id: string }): Promise<RxDocument<AccountDocType>>;
function updateAccount({ database }: { database: Database }, accountId: string, accountData: Partial<AccountDocType>): Promise<RxDocument<AccountDocType>>;
```

- 说明：更新一个 account。
  
## getVaultOfAccount

- 类型：
```typescript
const getVaultOfAccount: (accountIdOrAccount: string | AccountDocType) => Promise<RxDocument<VaultDocType> | undefined>
```

- 说明：获取一个 account 对应的 vault。

## deleteAccount

- 类型：
```typescript
const deleteAccount: (accountIdOrAccount: string | AccountDocType) => Promise<AccountDocType>
```

- 说明：删除一个 account。

## getVaultOfAccount

- 类型：
```typescript
const getVaultOfAccount: (accountIdOrAccount: string | AccountDocType) => Promise<RxDocument<VaultDocType>>
```

- 说明：获取一个 account 的 vault。

## getPrivateKeyOfAccountInChain

- 类型：
```typescript
/**
 * Function of @cfx-kit/wallet-core-chains/base
 */
type GetDerivedFromMnemonic = ChainMethods['getDerivedFromMnemonic'];

const getPrivateKeyOfAccountInChain: 
  ({
    accountIdOrAccount,
    getDerivedFromMnemonic,
  }: {
    accountIdOrAccount: string | AccountDocType;
    getDerivedFromMnemonic: GetDerivedFromMnemonic;
  }) => Promise<string>
```

- 说明：获取一个 account 在指定链上的私钥。

## addChain

- 类型：
```typescript
type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ParamsWithEndpoints = SetOptional<Omit<ChainDocType, 'id'>, 'chainId'>;
type ParamsWithEndpoint = Omit<ParamsWithEndpoints, 'endpoints'> & { endpoint: string };

const addChain: (params: ParamsWithEndpoint | ParamsWithEndpoints) => Promise<RxDocument<ChainDocType>>;
```

- 说明：增加一个 chain。

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

## setCurrentChain

- 类型：
```typescript
const setCurrentChain: (chainOrId: ChainDocType | string | null) => Promise<void>
```

- 说明：设置当前链。

## setCurrentAccount

- 类型：
```typescript
const setCurrentAccount: (accountOrId: AccountDocType | string | null) => Promise<void>
```

- 说明：设置当前账户。
