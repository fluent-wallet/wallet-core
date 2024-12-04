<script setup>
import { ref } from 'vue';

const packageManager = ref('pnpm');
const framework = ref('React');
</script>

# Quick Start {#quick-start}

An example of a web page with non-persistent storage - data is stored in memory.

## Installation {#installation}

### Prerequisites {#prerequisites}

- [Node.js](https://nodejs.org/) version 22 and above.

::: tabs key:ReactVue3Svelte

== React

```shell
npm install @cfx-kit/wallet-core-database @cfx-kit/wallet-core-methods @cfx-kit/wallet-core-wallet @cfx-kit/wallet-core-react-inject rxjs rxdb
```

==

== Vue3

```shell
npm @cfx-kit/wallet-core-database @cfx-kit/wallet-core-methods @cfx-kit/wallet-core-wallet @cfx-kit/wallet-core-vue3-inject rxjs rxdb
```

==

== Svelte

```shell
npm @cfx-kit/wallet-core-database @cfx-kit/wallet-core-methods @cfx-kit/wallet-core-wallet @cfx-kit/wallet-core-svelte-inject rxjs rxdb
```

==

:::

## Create Wallet Instance {#create-wallet-instance}

::: tabs key:ReactVue3Svelte

== React

```ts
/** For example, in wallet.ts file */
import WalletClass, { Encryptor, MemoryPassword } from '@cfx-kit/wallet-core-wallet';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import methods from '@cfx-kit/wallet-core-methods/allMethods'; // Import all built-in methods
import { inject } from '@cfx-kit/wallet-core-react-inject';
import SolanaChainMethods, { SolanaNetworkType, SolanaMainnet, SolanaTestnet } from '@cfx-kit/wallet-core-chains/solana';
import EVMChainMethods, { EVMNetworkType, EthereumMainnet, EthereumSepolia } from '@cfx-kit/wallet-core-chains/evm';

/** The wallet needs to support what chain, so import the methods of that chain */
const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

/** Create a memory-resident password management instance and export it for UI layer to handle password input during lock */
export const memoryPassword = new MemoryPassword();

/** Create a wallet instance and export it, subsequent methods/chains are called by the instance */
export const wallet = new WalletClass<typeof methods, typeof chains>({
  methods,
  chains,
  databaseOptions: {
    storage: getRxStorageMemory(), // Account data will be stored in memory (generally used in dev environment, lost on refresh)
    encryptor: new Encryptor(memoryPassword.getPassword.bind(memoryPassword)), // Wallet password temporarily stored in memory, input once during unlock
  },
  injectDatabasePromise: [inject],
});

/**
 * To add built-in chains, simply call addChain in IIFE.
 */
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

== Vue3

```ts
/** For example, in wallet.ts file */
import WalletClass, { Encryptor, MemoryPassword } from '@cfx-kit/wallet-core-wallet';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import methods from '@cfx-kit/wallet-core-methods/allMethods'; // Import all built-in methods
import { inject } from '@cfx-kit/wallet-core-vue3-inject';
import SolanaChainMethods, { SolanaNetworkType, SolanaMainnet, SolanaTestnet } from '@cfx-kit/wallet-core-chains/solana';
import EVMChainMethods, { EVMNetworkType, EthereumMainnet, EthereumSepolia } from '@cfx-kit/wallet-core-chains/evm';

/** The wallet needs to support what chain, so import the methods of that chain */
const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

/** Create a memory-resident password management instance and export it for UI layer to handle password input during lock */
export const memoryPassword = new MemoryPassword();

/** Create a wallet instance and export it, subsequent methods/chains are called by the instance */
export const wallet = new WalletClass<typeof methods, typeof chains>({
  methods,
  chains,
  databaseOptions: {
    storage: getRxStorageMemory(), // Account data will be stored in memory (generally used in dev environment, lost on refresh)
    encryptor: new Encryptor(memoryPassword.getPassword.bind(memoryPassword)), // Wallet password temporarily stored in memory, input once during unlock
  },
  injectDatabasePromise: [inject],
});

/**
 * To add built-in chains, simply call addChain in IIFE.
 */
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

== Svelte

```typescript-vue
/** For example, in wallet.ts file */
import WalletClass, {
  Encryptor,
  MemoryPassword
} from '@cfx-kit/wallet-core-wallet';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import methods from '@cfx-kit/wallet-core-methods/allMethods'; // Import all built-in methods
import { inject } from '@cfx-kit/wallet-core-svelte-inject';
import SolanaChainMethods, {
  SolanaNetworkType,
  SolanaMainnet,
  SolanaTestnet,
} from '@cfx-kit/wallet-core-chains/solana';
import EVMChainMethods, {
  EVMNetworkType,
  EthereumMainnet,
  EthereumSepolia,
} from '@cfx-kit/wallet-core-chains/evm';

/** The wallet needs to support what chain, so import the methods of that chain */
const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

/** Create a memory-resident password management instance and export it for UI layer to handle password input during lock */
export const memoryPassword = new MemoryPassword();

/** Create a wallet instance and export it, subsequent methods/chains are called by the instance */
export const wallet = new WalletClass<typeof methods, typeof chains>({
  methods,
  chains,
  databaseOptions: {
    storage: getRxStorageMemory(), // Account data will be stored in memory (generally used in dev environment, lost on refresh)
    encryptor: new Encryptor(memoryPassword.getPassword.bind(memoryPassword)) // Wallet password temporarily stored in memory, input once during unlock
  },
  injectDatabasePromise: [inject],
});

/**
 * To add built-in chains, simply call addChain in IIFE.
 */
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

:::

## Entry Inject Data {#framework-inject}

::: tabs key:ReactVue3Svelte

== React

```typescript-vue
{{ reactInjectContent}}
```

==

== Vue3

```typescript-vue
{{ vueInjectContent }}
```

==

== Svelte

==

:::

## Next, let's start building your wallet from the routing

For detailed concepts and APIs, please start from [Data, Model, Methods](../model-and-data/database-model).
