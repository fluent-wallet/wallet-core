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
