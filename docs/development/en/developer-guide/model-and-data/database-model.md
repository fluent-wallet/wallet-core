# Vault

Vault is an encrypted container used to store account credentials. Each Vault can store different types of data based on its type, such as mnemonic phrases or private keys. The data in a Vault is encrypted and stored in a database, and is not directly exposed to the user.

## Data Model

| Key      | Type    | Required | Description                                                                  |
| -------- | ------- | -------- | ---------------------------------------------------------------------------- |
| id       | string  | true     | Unique identifier.                                                           |
| value    | string  | false    | Encrypted value of mnemonic or private key.                                  |
| name     | string  | true     | Name.                                                                        |
| type     | string  | true     | Type of the Vault, such as `privateKey`, `mnemonic`, `hardware`, etc.        |
| source   | string  | true     | Source of the Vault, enum values: `create` (created) or `import` (imported). |
| isBackup | boolean | true     | Flag indicating whether it has been backed up.                               |
| accounts | array   | false    | Associated Account.                                                          |

# Account

Account is an object generated by Vault, containing information such as HD index (hdIndex), name (name), whether it is hidden (hidden), and linking to the parent Vault and child Address.

## Data Model

| Key       | Type    | Required | Description                                                                                          |
| --------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| id        | string  | true     | Unique identifier.                                                                                   |
| hdIndex   | number  | true     | Index number in BIP39 standard, used to determine the position of generated public and private keys. |
| name      | string  | true     | Name.                                                                                                |
| hidden    | boolean | false    | Whether it is hidden.                                                                                |
| vault     | string  | true     | Associated parent Vault ID.                                                                          |
| addresses | array   | false    | Associated child addresses, array elements are address IDs.                                          |

# Address

Address is an object generated by Account, containing the public key address (publicAddress) and the encrypted private key (privateKey), which can be used for signing transactions.

## Data Model

| Key           | Type   | Required | Description            |
| ------------- | ------ | -------- | ---------------------- |
| id            | string | true     | Unique identifier.     |
| publicAddress | string | true     | Public key address.    |
| privateKey    | string | false    | Encrypted private key. |
| account       | string | true     | Parent Account.        |
| chain         | string | true     | Associated Chain.      |

# Chain

Each Address belongs to a specific chain, and Chain records the information of that chain, including its name, type, chain ID, endpoints, and more.

## Data Model

| Key       | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| id        | string | true     | Unique identifier.                             |
| name      | string | true     | Name of the chain.                             |
| type      | string | true     | Type of the chain.                             |
| chainId   | string | true     | Chain ID.                                      |
| endpoints | array  | true     | Endpoints to connect to the chain.             |
| icon      | string | true     | Icon of the chain.                             |
| scanUrl   | string | true     | Scan URL of the chain.                         |
| chainType | string | true     | Type of the chain, such as Mainnet or Testnet. |
| addresses | array  | false    | Associated Addresses.                          |
