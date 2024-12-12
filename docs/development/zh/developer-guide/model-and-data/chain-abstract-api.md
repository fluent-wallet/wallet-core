# chains
::: tip NOTE
链部分的代码处于 [monorepo](https://github.com/fluent-wallet/wallet-core) 中的独立目录 [chains](https://github.com/fluent-wallet/wallet-core/tree/main/chains) 下，
并且**每一类链**都是独立子目录、独立发包的，可以视作精简版、标准化的链 js-sdk 单独使用。
对应的 npm包为 `@cfx-kit/wallet-core-chains-{chain}`。
**在开发钱包时，你需要支持哪些链，就得引入哪些链的 npm包 (或者自己实现的)**。
:::

**链的方法与 WalletCore 本身是无关的，它们的作用是生成 WalletCore 各个表所需的数据**。

目录中的 `chains/base` 是所有链都需要实现的抽象类 `ChainMethods`。
各个链的**实现类**位于 `chains/xxx` 目录下，比如
+ `chains/evm` 是 EVM 链的**实现类**；
+ `chains/solana` 是 Solana 链的**实现类**。

```
.
│─ core
│  ├─ ...
├─ chains
│  ├─ base
│  ├─ evm
│  ├─ solana
│  ├─ ...
└─
```


**实现类**中会实现 `ChainMethods` 中的方法，除此之外，**还会实现一些链特有的方法**。

如果你需要支持的链尚未被官方实现，你可以参考 [core/chains](https://github.com/fluent-wallet/wallet-core/tree/main/chains) 目录下的各个链，自己实现一个即可。

官方对各个链的实现中，不仅包含了 `ChainMethods` 的实现，还依据 [数据库模型](./database-model.md) 中 `Chain`表 的类型，提供了这些链常见的 主网/测试网 的配置变量，并为 `type` 提供了统一的常量。

我们推荐按 [example](https://github.com/fluent-wallet/wallet-core/tree/main/examples/react-example/src/wallet) 中的方式 组织、配置 chains 和 [WalletClass instance](./wallet-class.md)。

注意下列示例代码中的 **wallet.ts**，[WalletClass instance](./wallet-class.md) 可以接收 chains 属性作为参数，我们推荐 follow 这个做法，这样做可以让 **chainMthods** 与 [methods](./methods.md) 的使用方式保持一致。

::: tabs
== ./chains.ts
```typescript
import EVMChainMethods, { EVMNetworkType, EthereumSepolia, EthereumMainnet }
  from '@cfx-kit/wallet-core-chains-evm';
import SolanaChainMethods, { SolanaNetworkType, SolanaTestnet, SolanaMainnet }
  from '@cfx-kit/wallet-core-chains-solana';

// 所有需要支持类型的链的方法集合
export const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

// 所需的内置网络的配置
export {
  EVMNetworkType,
  SolanaNetworkType,
  EthereumSepolia,
  EthereumMainnet,
  SolanaTestnet,
  SolanaMainnet,
}
==
```

== ./wallet.ts
```typescript
import {
  chains,
  EthereumSepolia,
  EVMNetworkType,
  SolanaNetworkType,
  EthereumMainnet,
  SolanaTestnet,
  SolanaMainnet,
} from './chains';
export { chains } from './chains';

// 可以选择将 chains 注入到 WalletClass instance 中使用
export const wallet = new WalletClass<typeof methods, typeof chains>({
  chains,
});

// 初始化内置网络
(async () => {
  wallet.initPromise.then(() => {
    wallet.methods.addChain({ ...EthereumSepolia, type: EVMNetworkType });
    wallet.methods.addChain({ ...EthereumMainnet, type: EVMNetworkType });
    wallet.methods.addChain({ ...SolanaTestnet, type: SolanaNetworkType });
    wallet.methods.addChain({ ...SolanaMainnet, type: SolanaNetworkType });
  });
})();
```
==

== somewhere-use.ts
```typescript
import { wallet } from '@wallet';
import { chains, SolanaNetworkType } from '@chains';

// 推荐把 chains 注入到 WalletClass instance 中使用
wallet.methods.addPrivateKeyVault({
  privateKey: wallet.chains.Solana.getRandomPrivateKey(),
  source: 'create'
})

wallet.chains[SolanaNetworkType].getRandomPrivateKey();

const App: React.FC = () => {
  const currentChain = useCurrentChain();

  return (
    <button onClick={() => {
      wallet.chains[currentChain.type].getRandomPrivateKey();
    }}>
      getRandomPrivateKey of {currentChain.name}
    </button>
  );
}



// 也可以直接从 chains.ts 导入
wallet.methods.addPrivateKeyVault({
  privateKey: chains.Solana.getRandomPrivateKey(),
  source: 'create'
})
```
==
:::
<br/>
<br/>

# Common Base ChainMethods

## isValidPrivateKey

- 类型：
```typescript
const isValidPrivateKey(privateKey: string): boolean;
```

- 说明：判断私钥是否是这条链下的合法私钥。


## isValidAddress

- 类型：
```typescript
const isValidAddress(address: string): boolean;
```

- 说明：判断公钥地址是否是这条链下的合法地址。


## getDerivedFromMnemonic

- 类型：
```typescript
const getDerivedFromMnemonic(params: { mnemonic: string; hdPath?: string; index: number; chainId?: string }): { privateKey: string; publicAddress: string };
```

- 说明：从助记词中推导出私钥和公钥地址。


## getAddressFromPrivateKey

- 类型：
```typescript
const getAddressFromPrivateKey(params: { privateKey: string }): string;
```

- 说明：从私钥中推导出公钥地址。

## getRandomPrivateKey

- 类型：
```typescript
const getRandomPrivateKey(): string;
```

- 说明：生成一条链下的随机私钥。

## signTransaction

- 类型：
```typescript
const signTransaction(params: { privateKey: string; data: any }): Promise<any>;
```

- 说明：对交易数据进行签名。


## signMessage

- 类型：
```typescript
const signMessage(params: { privateKey: string; data: any }): Promise<string>;
```

- 说明：对消息进行签名。

## isAddressEqual

- 类型：
```typescript
const isAddressEqual(address1: any, address2: any): boolean;
```

- 说明：判断两个公钥地址是否相等。

<br/>
<br/>
<br/>
<br/>

# BTC 独有

<br/>
<br/>
<br/>
<br/>

# EVM 独有

<br/>
<br/>
<br/>
<br/>

# Solana 独有
