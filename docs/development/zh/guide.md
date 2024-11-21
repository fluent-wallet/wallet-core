<p align="center" width="400">
  <img src="../document/logo.svg" width="400" />
</p>


# Tether 钱包开发工具包


多资产加密货币钱包 JavaScript 库。
支持3个平台：Node.js、浏览器、Bare Runtime

访问官网 [点击这里](https://wallet.tether.io/)




## ⭐ 特点

🔑 **非托管:** 你的密钥，你的币。

🧩 **可组合:** 单一界面操作多种资产和钱包

📦 **模块化:** 所有组件都是模块化的，可以独立使用。

🛠️ **可扩展:** 轻松添加新资产、种子源、区块源等

## 🔗 区块链

### [比特币](https://github.com/tetherto/lib-wallet-pay-btc)
- Electrum 区块数据源。支持浏览器上的 TCP 和 Websocket。
- 支持 P2WPKH / BIP84 地址。

### [以太坊上的 USDT](https://github.com/tetherto/lib-wallet-pay-eth)
- Web3 和 [索引器](https://github.com/tetherto/lib-wallet-indexer) 区块数据源。
- 支持 ERC20。
- BIP44 地址生成。

| 区块链   	    | 是否支持    | 代币协议
|---	        |---	      |--
| 比特币 	    |  ✅ 	      | -
| 以太坊  	    |  ✅ 	      | ERC20
| 波场 	        |  ⌛ 	      | TRC20
| TON 	        |  ⌛	      | Jettons
| 雪崩 	        |  ⌛	      | C-Chain
| 索拉纳 	    |  ⌛ 	      | Solana Token
| Celo 	        |  ⌛	      | ERC20
| Liquid 	    |  ⌛ 	      | Liquid Asset
| Tezos 	    |  ⌛ 	      | Tezos Token
| Aptos 	    |  ⌛ 	      | Fungible Asset
| Cosmos 	    |  ⌛ 	      | ERC20
| Near 	        |  ⌛ 	      | Near Token
| Polkadot 	    |  ⌛ 	      | AssetHub

### 🏗️ 架构
<p align="center" width="10" height=10>
  <img src="./assets/architecture.png "  width="500"/>
</p>


###  组件和链接
该库包含构建钱包所需的所有组件。你也可以将这些组件作为示例来构建自己的组件。

- [BIP39 种子](https://github.com/tetherto/lib-wallet-seed-bip39): 为所有资产生成 BIP39 种子
- [键值存储](https://github.com/tetherto/lib-wallet-store): 存储交易历史并跟踪状态
- [区块链索引器](https://github.com/tetherto/lib-wallet-indexer): 远程区块链数据提供者
- [测试工具](https://github.com/tetherto/wallet-lib-test-tools): 开发和测试工具
- [文档](https://wallet.tether.io/): 指南和文档
- [比特币](https://github.com/tetherto/lib-wallet-pay-btc): 比特币资产集成
- [以太坊/ERC20](https://github.com/tetherto/lib-wallet-pay-eth): 以太坊和 ERC20 集成


### **</>** 使用示例

查看[快速入门指南](./docs/)获取更详细的指导。

```javascript
  const seed = await BIP39Seed.generate(/** 助记词，留空则生成新的 */)

  // 设置钱包存储。用于写入数据的模块化数据存储
  const store = new WalletStoreHyperbee({
    store_path: './wallet-store' // 留空则使用内存存储
  })

  // 设置比特币资产
  const btcPay = new BitcoinPay({
    // 资产名称用于在钱包中识别资产
    // 你可以拥有同一货币的多个资产
    asset_name: 'btc',
    // 你将使用的比特币网络
    network: 'regtest'
  })

  // 设置主钱包类
  const wallet = new Wallet({
    store,
    seed,
    // 钱包将支持的资产列表
    assets: [ btcPay ]
  })

  // 启动钱包并初始化
  // 连接到区块源
  // 将资产添加到钱包注册表
  await wallet.initialize()

  // 遍历所有资产的钱包历史并同步它们。根据钱包大小，这可能需要一些时间
  await wallet.syncHistory(opts)

  // 所有支付功能都在 wallet.pay[asset_name][action](opts, ...args) 下命名空间
  // 使用以下 API 获取新的比特币地址
  const btcAddress = await wallet.pay.btc.getNewAddress()

  // 获取交易历史
  await wallet.pay.btc.getTransactions({}, (tx) =>{
    // 在这里处理
  }))

  // 添加资产:
  wallet.addAsset()
  // 完成
```

### 钱包 API 文档

## 构造函数
```javascript
new Wallet(config)
```
创建一个新的钱包实例。

### 参数
- `config` (对象):
  - `store` (对象): 必需。钱包的存储接口
  - `seed` (对象): 必需。钱包初始化的种子对象
  - `assets` (数组): 必需。由钱包管理的资产对象数组

### 抛出
- 如果缺少必需的配置参数或无效，则抛出代码为 'BAD_ARGS' 的 `WalletError`

## 方法

### initialize()
```javascript
await wallet.initialize()
```
初始化钱包和所有资产。完成时发出 'ready' 事件。

### destroy()
```javascript
await wallet.destroy()
```
清理销毁钱包实例，关闭存储和网络连接。

### addAsset(assetObj)
```javascript
await wallet.addAsset(assetObj)
```
向钱包添加新资产。
- `assetObj` (对象): 要添加的资产实例

### syncHistory([options])
```javascript
await wallet.syncHistory({
    asset : 'asset-name' // 仅同步此资产
})

await wallet.syncHistory() // 同步所有内容
```
同步资产的交易历史。

#### 选项
- `asset` (字符串): 可选。同步特定资产名称
- `all` (布尔值): 可选。如果为 true，则同步资产的所有代币
- 其他选项将传递给 asset.syncTransactions()

### exportSeed()
```javascript
const seed = wallet.exportSeed()
```
导出钱包的种子数据。

## 事件

钱包继承自 EventEmitter 并发出以下事件：

- `ready`: 钱包完全初始化时发出
- `new-tx`: 检测到新交易时发出
  - 参数: `(assetName, ...transactionDetails)`
- `new-block`: 检测到新区块时发出
  - 参数: `(assetName, ...blockDetails)`
- `asset-synced`: 资产完成同步时发出
  - 参数: `(assetName, [token])`

## 属性

### pay
包含所有已初始化资产的 AssetList 实例。初始化后可用。


# 开发

## 🚀 入门

开始开发的最佳方式：

1. 设置本地开发环境。
2. 配置示例应用程序以连接到本地区块链。
3. 开始修改示例应用程序。
在运行示例应用程序后：
- 分叉/修改现有资产
- 构建新资产

## 🐚 Seashell 示例钱包
这是一个可用的示例钱包。这个钱包可以用作制作自己集成的示例。
- [Node.js 命令行钱包](./example/node)
- [Bare runtime 命令行钱包](./example/bare)
- [AI 代理钱包](./example/web)


## 🛠️ 开发环境
该钱包设计为可与本地测试环境一起工作。
- 查看 [钱包测试工具仓库](https://github.com/tetherto/wallet-lib-test-tools) 以设置本地环境
- 设置 [钱包索引器](https://github.com/tetherto/lib-wallet-indexer) 服务

## 🍱 构建自己的资产
查看[指南](./docs)了解如何添加新资产

## 🧪 测试
- 使用 [Brittle](https://github.com/holepunchto/brittle) 进行测试
- 此仓库中包含的测试涵盖
    - 共享模块
    - 各种区块链的集成
- 每个资产在其仓库中都有自己的测试。


## 安全
对于关键漏洞和错误报告，请通过 bounty@tether.io 联系我们。
您的见解帮助我们保持 Tether 的 WDK 安全可靠！