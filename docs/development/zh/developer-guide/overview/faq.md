# WalletCore 是什么？ {#what-is-vitepress}

WalletCore 是一个钱包核心功能库，专为构建快速 Web3 钱包而设计。内置了钱包的账户管理、资产管理、交易签发、交易历史等核心功能，实现了部分热门链的支持，并允许自定义扩展接入其他未内置实现的链。

只是想尝试一下？跳到[运行样例](./getting-started)。


## WalletCore 支持跨端吗？ {#cross-platform}

WalletCore 的存储层基于 [RxDB](https://rxdb.info/)，RxDB 不是一个自包含的数据库，各端都有支持的底层存储层接入（可能需要为一些高性能的选择付费，不过移动端、插件端、Web 端都有免费的存储层可选），详情可见 [Rxstoarge Layer](https://rxdb.info/rx-storage.html)。

也得益于此，WalletCore 在各端的开发体验是一致的，同时开发多端 web3钱包 时可以共用逻辑和数据层，只需要实现各自的UI。


## 可以用任意前端框架接入吗？ {#cross-frontend-framework}

是的，WalletCore 的数据层以 Observable 的形式实现，提供 [@cfx-kit/wallet-core-observable]() 这个 lib，导出了对所有数据的 observe 支持。基于这个 lib，实现了对 React、Vue3、Svelte 的支持。如果您使用的框架不在其中，或者不满意官方的实现，也可以基于或者参考这个 lib，自己实现对框架的支持。


## 如何保证 助记词/私钥 的安全？ {#security}

WalletCore 提供一个 encryptor 的机制，允许自定义对助记词的加解密方式，也提供了内置的两种密码管理方式：

- 签发时密码输入（不存储密码，每次签发交易时都需要输入密码）
- 内存密码常驻（解锁钱包时将密码存储在内存中，锁定钱包后清空）


## 如何支持列表中没有的链？ {#support-new-chain}

WalletCore 内置了部分热门链的支持，未内置的新链只需要实现 chains 中的 Base 抽象类即可。

详细见[支持一条新链](../extend)。

## 当前网络模式还是多网络模式？ {#multi-single-network}

WalletCore 设计上既支持 MetaMask 那样的当前网络模式，也支持 OKWallet 那样的多网络模式。

## 需要自己实现钱包的 UI 吗？ {#ui}

是的，WalletCore 只提供钱包的核心功能，UI 需要自己实现（可以参考 Example 的大致流程）。并且需要选择、组合、实现一些钱包的细节 feature，比如：
- 插件钱包常见的 密码常驻模式，或者 Mobile 钱包常见的 签发时密码输入模式
- Rainbow 钱包式的初始化即备份助记词，或者将助记词备份流程放在初始化钱包完成后的首页提示中（与非初始化创建新助记词账户一致）
- 初始化时候，是先初始化密码还是先创建助记词账户，如果没走完全部流程直接关闭钱包，下次打开时候是否需要重新走一遍流程，等等


## Wallet-Connect / 硬件钱包 / Window 注入（ERC6963）等对外功能 WalletCore 支持吗？ {#external-function}

是的，WalletCore 提供了这些常见功能的实现，搭起一个覆盖常见功能的 Web3 钱包只需要组装配置即可。


## 关于开源协议 {#license}

MIT，请自便。