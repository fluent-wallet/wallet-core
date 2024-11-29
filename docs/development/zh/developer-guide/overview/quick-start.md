<script setup>
import { ref } from 'vue';

const packageManager = ref('pnpm');
const framework = ref('React');
</script>

# 快速开始 {#quick-start}

以不持久化存储的 web页面-数据置于内存 为例


## 安装 {#installation}

### 前置准备 {#prerequisites}

- [Node.js](https://nodejs.org/) 22 及以上版本。

<div style="display: flex; flex-direction: row; gap: 16px;">
  <FrontendFramework lang="zh" v-model="framework" />
  <PackageManager lang="zh" v-model="packageManager" />
</div>

```sh-vue
$ {{ packageManager }} add
  @cfx-kit/wallet-core-database @cfx-kit/wallet-core-methods
  @cfx-kit/wallet-core-wallet @cfx-kit/wallet-core-{{ framework.toLowerCase() }}-inject
  rxjs rxdb
```



## 创建 Wallet 实例 {#create-wallet-instance}

```typescript-vue
/** 比如在 wallet.ts 文件中 */
import WalletClass, {
  Encryptor,
  MemoryPassword
} from '@cfx-kit/wallet-core-wallet';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import methods from '@cfx-kit/wallet-core-methods/allMethods'; // 引入所有内置 methods
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

/** 钱包需要支持什么chain，就引入什么 chain 的 methods */
const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
};

/** 创建一个 内存常驻式密码管理实例 并导出，供UI层处理lock时输入密码之类的 */
export const memoryPassword = new MemoryPassword();

/** 创建钱包实例并且导出，后续 methods / chains 方法由实例调用 */
export const wallet = new WalletClass<typeof methods, typeof chains>({
  methods,
  chains,
  databaseOptions: {
    storage: getRxStorageMemory(), // 账户数据将存储在内存中(一般 dev 环境使用，刷新就没了)
    encryptor: new Encryptor(memoryPassword.getPassword.bind(memoryPassword)) // 钱包密码暂存于内存中，解锁时候输入一次即可
  },
  injectDatabasePromise: [inject],
});

/**
 * 想添加内置的链，直接在 IIFE 中调用 addChain即可。
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
const reactContent = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store, Provider } from '@cfx-kit/wallet-core-react-inject';
import wallet from '@wallet/index';
import Router from '@router/index';

/**
 * 实例init过程很快大概100ms以内，所以最方便的做法是直接在入口文件等待init完成再初始化 framework
 * 当然也提供了hooks形式判断初始化完成的方法，详见 TODO:
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

const vueContent = `import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { provider } from '@cfx-kit/wallet-core-vue-inject/src';
import wallet from '@wallet/index';

const pinia = createPinia()
const app = createApp(App);
app.use(pinia);

/**
 * 实例init过程很快大概100ms以内，所以最方便的做法是直接在入口文件等待init完成再初始化 framework
 * 当然也提供了hooks形式判断初始化完成的方法，详见 TODO:
 */
wallet.initPromise.then(({ database }) => {
  provider(app, database);
  app.mount('#app');
});
`;
</script>

## {{ framework }} 入口接入数据 inject {#framework-inject}
```typescript-vue
/** main.ts{{ framework === 'React' ? 'x' : '' }} 中 */
{{ framework === 'Vue3' ? vueContent : reactContent }}
```
