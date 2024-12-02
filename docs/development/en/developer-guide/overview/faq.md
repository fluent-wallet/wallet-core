# What is WalletCore? {#what-is-vitepress}

WalletCore is a core functionality library for wallets, designed for building fast Web3 wallets. It includes core features such as account management, asset management, transaction signing, and transaction history, supports several popular chains, and allows for custom extensions to integrate other chains not natively supported.

Just want to give it a try? Jump to the [Run Sample](./getting-started).


## Does WalletCore support cross-platform? {#cross-platform}

The storage layer of WalletCore is based on [RxDB](https://rxdb.info/). RxDB is not a self-contained database; each platform has supported underlying storage layer integrations (some high-performance options may require payment, but there are free storage layers available for mobile, plugin, and web platforms). For details, see [RxStorage Layer](https://rxdb.info/rx-storage.html).

Thanks to this, the development experience of WalletCore is consistent across platforms, allowing shared logic and data layers when developing multi-platform web3 wallets, with only the UI needing to be implemented separately.


## Can any front-end framework be integrated? {#cross-frontend-framework}

Yes, the data layer of WalletCore is implemented in an Observable form, providing the [@cfx-kit/wallet-core-observable]() library, which exports support for observing all data. Based on this library, support for React, Vue3, and Svelte has been implemented. If the framework you are using is not included, or if you are not satisfied with the official implementation, you can implement support for your framework based on or by referencing this library.


## How to ensure the security of mnemonic phrases/private keys? {#security}

WalletCore provides an encryptor mechanism that allows for custom encryption and decryption methods for mnemonic phrases, as well as two built-in password management methods:

- Password input at signing (does not store the password; requires input every time a transaction is signed)
- In-memory password retention (stores the password in memory when unlocking the wallet and clears it after locking the wallet)


## How to support chains that are not listed? {#support-new-chain}

WalletCore has built-in support for several popular chains; for new chains not included, simply implement the Base abstract class in chains.

For details, see [Support a New Chain](../extend).

## Is the current network mode still single or multi-network? {#multi-single-network}

WalletCore is designed to support both the current network mode like MetaMask and the multi-network mode like OKWallet.

## Do I need to implement the wallet's UI myself? {#ui}

Yes, WalletCore only provides core wallet functionalities; the UI needs to be implemented by yourself (you can refer to the general process in Example). Additionally, you need to choose, combine, and implement some wallet detail features, such as:
- Common password retention mode for plugin wallets, or password input mode at signing for mobile wallets
- Initialization with backup mnemonic phrases like Rainbow wallet, or placing the mnemonic backup process in the homepage prompt after wallet initialization (consistent with creating a new mnemonic account)
- During initialization, whether to initialize the password first or create the mnemonic account first, and whether to require going through the entire process again if the wallet is closed before completion, etc.


## Does WalletCore support external functions like Wallet-Connect / hardware wallets / Window injection (ERC6963)? {#external-function}

Yes, WalletCore provides implementations for these common functionalities, allowing you to assemble a Web3 wallet that covers common features easily.


## About the open-source license {#license}

MIT, feel free to use it.
