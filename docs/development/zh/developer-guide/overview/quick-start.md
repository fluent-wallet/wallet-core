<script setup>
import { ref } from 'vue';

const packageManager = ref('pnpm');
const framework = ref('react');
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
  @cfx-kit/wallet-core-wallet @cfx-kit/wallet-core-{{ framework }}-inject
  rxjs rxdb
```

