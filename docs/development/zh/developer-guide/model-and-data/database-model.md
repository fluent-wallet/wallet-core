# Vault

Vault 是一个用于存储账号凭证的加密容器。每个 Vault 可以根据类型存储不同的数据，例如助记词（Mnemonic）、私钥（PrivateKey）等。Vault 中的数据经过加密后存储在数据库中，不会直接暴露给用户。

## 数据模型

| Key      | Type    | Required | Description                                                  |
| -------- | ------- | -------- | ------------------------------------------------------------ |
| id       | string  | true     | 唯一标识符。                                                 |
| value    | string  | false    | 加密后的助记词或私钥等值。                                   |
| name     | string  | true     | 名称。                                                       |
| type     | string  | true     | Vault 的类型，例如 `privateKey`、`mnemonic`、`hardware` 等。 |
| source   | string  | true     | Vault 的来源，枚举值：`create`（创建）或 `import`（导入）。  |
| isBackup | boolean | true     | 标识是否已备份。                                             |
| accounts | array   | false    | 关联的 Account                                               |

# Account

Account 是由 Vault 生成的对象，包含 HD 索引（hdIndex）、名称（name）、是否隐藏（hidden）等信息，并关联上级 Vault 和下级 Address。

## 数据模型

| Key       | Type    | Required | Description                                          |
| --------- | ------- | -------- | ---------------------------------------------------- |
| id        | string  | true     | 唯一标识符。                                         |
| hdIndex   | number  | true     | BIP39 标准中的索引号，用于确定生成的公钥和私钥位置。 |
| name      | string  | true     | 名称。                                               |
| hidden    | boolean | false    | 是否隐藏。                                           |
| vault     | string  | true     | 关联的上级 Vault ID。                                |
| addresses | array   | false    | 关联的下级地址，数组元素为地址 ID。                  |

# Address

Address 是由 Account 生成的对象，包含公钥地址（publicAddress）和加密后的私钥（privateKey），可用于签名交易等操作。

## 数据模型

| Key           | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| id            | string | true     | 唯一标识符。     |
| publicAddress | string | true     | 公钥地址。       |
| privateKey    | string | false    | 加密后的私钥。   |
| account       | string | true     | 所属的 Account。 |
| chain         | string | true     | 关联的 Chain。   |

# Chain

每个 Address 都归属于一个具体的链，Chain 记录了该链的信息，包括名称（name）、类型（type）、链 ID（chainId）、端点（endpoints）等。

## 数据模型

| Key       | Type   | Required | Description                                          |
| --------- | ------ | -------- | ---------------------------------------------------- |
| id        | string | true     | 唯一标识符。                                         |
| name      | string | true     | 链的名称。                                           |
| type      | string | true     | 链的类型。                                           |
| chainId   | string | true     | 链 ID。                                              |
| endpoints | array  | true     | 链的连接地址。                                       |
| icon      | string | true     | 链的图标。                                           |
| scanUrl   | string | true     | 链的扫描 URL。                                       |
| chainType | string | true     | 链的类型，例如主网（Mainnet）、测试网（Testnet）等。 |
| addresses | array  | false    | 所属的 Address。                                     |
