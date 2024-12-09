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