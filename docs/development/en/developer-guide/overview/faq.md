# What is WalletCore? {#what-is-vitepress}

WalletCore is a wallet core functionality library designed for building fast Web3 wallets. It comes with built-in core wallet features including account management, asset management, transaction signing, transaction history, and implements support for several popular chains while allowing custom extensions for other chains not built-in.

Just want to try it out? Jump to [Running Examples](./getting-started).


## Does WalletCore support cross-platform? {#cross-platform}

WalletCore's storage layer is based on [RxDB](https://rxdb.info/). RxDB is not a self-contained database, and each platform has supported storage layer integrations (some high-performance options may require payment, but there are free storage layers available for mobile, plugin, and web platforms). For more details, see [Rxstoarge Layer](https://rxdb.info/rx-storage.html). 

As a result, WalletCore provides a consistent development experience across platforms, allowing for shared logic and data layers when developing multi-platform web3 wallets, with only the respective UIs needing to be implemented.

## Can it be integrated with any frontend framework? {#cross-frontend-framework}

Yes, WalletCore's data layer is implemented as Observables, providing [@cfx-kit/wallet-core-observable]() library that exports observe support for all data. Based on this library, support for React, Vue3, and Svelte has been implemented. If your framework isn't among these, or if you're not satisfied with the official implementation, you can implement framework support yourself based on or by referencing this library.


## How is the security of mnemonics/private keys ensured? {#security}

WalletCore provides an encryptor mechanism that allows customization of mnemonic encryption/decryption methods, and also provides two built-in encryption/decryption methods:

- Password input during signing (password is not stored, requires input for each transaction signing)
- Password retention in memory (password is stored in memory when wallet is unlocked, cleared after wallet is locked)


## How to support chains not in the list? {#support-new-chain}

WalletCore has built-in support for several popular chains. For new chains not built-in, you only need to implement the Base abstract class in chains.

See [Supporting a New Chain](../extend) for details.


## Do I need to implement the wallet UI myself? {#ui}

Yes, WalletCore only provides core wallet functionality, UI needs to be implemented by yourself (you can refer to the Example for general flow). You also need to select, combine, and implement some wallet detail features, such as:
- Plugin wallet's common password retention mode, or mobile wallet's common password input during signing mode
- Rainbow wallet-style mnemonic backup during initialization, or placing the mnemonic backup process in the homepage prompt after wallet initialization (consistent with non-initial creation of new mnemonic accounts)
- During initialization, whether to initialize password first or create mnemonic account first, if the wallet is closed directly without completing all processes, whether to go through the process again next time, etc.


## Does WalletCore support external functions like Wallet-Connect / Hardware Wallets / Window Injection (ERC6963)? {#external-function}

Yes, WalletCore provides implementations of these common functions. Building a Web3 wallet covering common features only requires assembly and configuration.


## About License {#license}

MIT, feel free to use.
