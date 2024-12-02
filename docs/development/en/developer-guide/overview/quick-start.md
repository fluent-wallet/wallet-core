<script setup>
import { ref } from 'vue';

const packageManager = ref('pnpm');
const framework = ref('React');
</script>

# Quick Start {#quick-start}

Taking a web page with non-persistent storage - data stored in memory as an example.

## Installation {#installation}

### Prerequisites {#prerequisites}

- [Node.js](https://nodejs.org/) version 22 and above.

<div style="display: flex; flex-direction: row; gap: 16px;">
  <FrontendFramework lang="en" v-model="framework" />
  <PackageManager lang="en" v-model="packageManager" />
</div>

```sh-vue
$ {{ packageManager }} add
  @cfx-kit/wallet-core-database @cfx-kit/wallet-core-methods
  @cfx-kit/wallet-core-wallet @cfx-kit/wallet-core-{{ framework.toLowerCase() }}-inject
  rxjs rxdb
```

## Create Wallet Instance {#create-wallet-instance}

```typescript-vue
/** For example, in wallet.ts file */
import WalletClass, {
  Encryptor,
  MemoryPassword
} from '@cfx-kit/wallet-core-wallet';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import methods from '@cfx-kit/wallet-core-methods/allMethods'; // Import all built-in methods
import { inject } from '@cfx-kit/wallet-core-{{ framework.toLowerCase() }}-inject';
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

/** Import the methods of the chains that the wallet needs to support */
const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

/** Create an instance of memory-resident password management and export it for UI layer to handle password input during lock */
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

<script>
const reactInjectContent = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store, Provider } from '@cfx-kit/wallet-core-react-inject';
import wallet from '@wallet/index';
import Router from '@router/index';

/**
 * The instance init process is very fast, about within 100ms, so the most convenient way is to wait for init to complete in the entry file before initializing the framework.
 * Of course, there are also hooks to determine when initialization is complete, see TODO:
 */
wallet.initPromise.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <Router />
      </Provider>
    </StrictMode>,
  );
});
`;

const vueInjectContent = `import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { provider } from '@cfx-kit/wallet-core-vue-inject/src';
import wallet from '@wallet/index';

const pinia = createPinia()
const app = createApp(App);
app.use(pinia);

/**
 * The instance init process is very fast, about within 100ms, so the most convenient way is to wait for init to complete in the entry file before initializing the framework.
 * Of course, there are also hooks to determine when initialization is complete, see TODO:
 */
wallet.initPromise.then(({ database }) => {
  provider(app, database);
  app.mount('#app');
});
`;

const reactRouterContent = `import { Routes, Route, Outlet, Navigate, BrowserRouter } from 'react-router-dom';
import { useIsPasswordInitialized, useVaultsCount } from '@cfx-kit/wallet-core-react-inject';

const AuthInitialize: React.FC<{ reverse?: boolean }> = ({ reverse }) => {
  const isPasswordInitialized = useIsPasswordInitialized();
  const vaultsCount = useVaultsCount();
  const isWalletInitialized = isPasswordInitialized && vaultsCount > 0;

  if (reverse) {
    if (isWalletInitialized) {
      return <Navigate to="/wallet" replace />;
    }
  } else {
    if (!isWalletInitialized) {
      return <Navigate to="/initialize" replace />;
    } else {
      return <Navigate to="/wallet/unlock" replace />;
    }
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route
          path="initialize"
          element={
            <>
              <Outlet />
              <AuthInitialize reverse />
            </>
          }
        >
          <Route path="create-or-import" element={<InitializeCreateOrImport />} />
          <Route path="set-password" element={<InitializePassword />} />
        </Route>

        <Route
          path="wallet"
          element={
            <>
              <Outlet />
              <AuthInitialize />
            </>
          }
        >
          <Route index element={<WalletHome />} />
          <Route path="unlock" element={<WalletUnlock />} />
        </Route>
      </Route>
    </Routes>
  );
};
`;

const vueRouterContent = `import { createRouter, createWebHistory } from 'vue-router';
import { useIsPasswordInitialized, useVaultsCount } from '@cfx-kit/wallet-core-vue-inject';
import WalletHome from './components/WalletHome.vue';
import WalletUnlock from './components/WalletUnlock.vue';
import InitializeCreateOrImport from './components/InitializeCreateOrImport.vue';
import InitializePassword from './components/InitializePassword.vue';

const routes = [
  {
    path: '/',
    component: () => import('./components/RootLayout.vue'),
    children: [
      {
        path: 'initialize',
        component: () => import('./components/InitializeLayout.vue'),
        children: [
          { path: 'create-or-import', component: InitializeCreateOrImport },
          { path: 'set-password', component: InitializePassword },
        ],
      },
      {
        path: 'wallet',
        component: () => import('./components/WalletLayout.vue'),
        children: [
          { path: '', component: WalletHome },
          { path: 'unlock', component: WalletUnlock },
        ],
      },
    ],
  },
];

router.beforeEach((to, from, next) => {
  const isPasswordInitialized = useIsPasswordInitialized();
  const vaultsCount = useVaultsCount();
  const isWalletInitialized = isPasswordInitialized && vaultsCount > 0;

  if (to.path === '/initialize' && isWalletInitialized) {
    next('/wallet');
  } else if (to.path === '/wallet' && !isWalletInitialized) {
    next('/initialize');
  } else {
    next();
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
`;
</script>

## {{ framework }} Entry Data Inject {#framework-inject}

```typescript-vue
/** main.ts{{ framework === 'React' ? 'x' : '' }} */
{{ framework === 'Vue3' ? vueInjectContent : reactInjectContent }}
```

## Next, let's build your wallet starting from the router.

For detailed concepts and APIs, please start from [Data, Models, and Methods](../model-and-data/database-model).

```typescript-vue
/** router.ts{{ framework === 'React' ? 'x' : '' }} */
{{ framework === 'Vue3' ? vueRouterContent : reactRouterContent }}
