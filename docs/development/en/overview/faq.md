## What is WalletCore? {#what-is-WalletCore}

WalletCore is a wallet core functionality library designed for building fast web3 wallets. It comes with built-in core wallet features such as account management, asset management, transaction signing, and transaction history. It implements support for several popular chains and allows custom extensions to integrate other chains that are not built-in.

Just want to try it out? Jump to [Running Examples](./getting-started).

</div>

#### Does WalletCore support cross-platform?

WalletCore's storage layer is based on [RxDB](https://rxdb.info/). RXDB is not a self-contained database; each platform has supported storage layer integrations (some high-performance options may require payment, but there are free storage layer options for mobile/plugin/web platforms). For details, see [RxStorage Layer](https://rxdb.info/rx-storage.html).

#### How does WalletCore ensure the security of mnemonics/private keys?

WalletCore provides an encryptor mechanism that allows customization of mnemonic encryption/decryption methods, and also provides two built-in encryption/decryption methods:

- Password input during signing (password is not stored, requires password input for each transaction signing)
- Memory-resident password (stores password in memory when wallet is unlocked, clears it when wallet is locked)

#### How to support chains that are not in the list?

WalletCore has built-in support for several popular chains. New chains that are not built-in only need to implement the Base abstract class in chains.

See [Supporting a New Chain](../extend) for details.

#### Do I need to implement the wallet UI myself?

Yes, WalletCore only provides core wallet functionality, UI needs to be implemented by yourself (you can refer to the Example's general process). You also need to select/combine/implement some wallet detail features, such as:
- Plugin wallet's common password-resident mode, or mobile wallet's common password input during signing mode
- Rainbow wallet-style mnemonic backup during initialization, or placing the mnemonic backup process in the homepage prompt after wallet initialization (consistent with non-initialization creation of new mnemonic accounts)
- During initialization, whether to initialize password first or create mnemonic account first. If the wallet is closed without completing all processes, whether to go through the process again next time, etc.

#### Does WalletCore support external features like Wallet-Connect / Hardware wallet integration / window injection (ERC6936)?

Yes, WalletCore provides implementations of these common features. Building a web3 wallet covering common features only requires assembly and configuration.

#### WalletCore License

MIT
