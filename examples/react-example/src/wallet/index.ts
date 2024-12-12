import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import WalletClass from '@cfx-kit/wallet-core-wallet/src';
import methods from '@cfx-kit/wallet-core-methods/src/allMethods';
import Encryptor from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor';
import walletConfig from './walletConfig';
import { interactivePassword, memoryPassword } from './passwordMethod';
import {
  chains,
  EthereumSepolia,
  EVMNetworkType,
  SolanaNetworkType,
  ConfluxNetworkType,
  EthereumMainnet,
  SolanaTestnet,
  SolanaMainnet,
  ConfluxTestnet,
  ConfluxMainnet,
} from './chains';
export * from './passwordMethod';
export { default as walletConfig } from './walletConfig';

const wallet = new WalletClass<typeof methods, typeof chains>({
  databaseOptions: {
    storage: walletConfig.storageMethod === 'Memory' ? getRxStorageMemory() : getRxStorageDexie(),
    encryptor:
      walletConfig.passwordMethod === 'persistence' ?
        new Encryptor(memoryPassword.getPassword.bind(memoryPassword))
        : new Encryptor(interactivePassword.getPassword.bind(interactivePassword)),
  },
  methods,
  chains,
});

/**
 * TODO:
 * 需要一种初始化内置chain数据的机制，并且支持后续再次增加内置chain
 * 以下写法用三问题
 * 一是每次都会执行
 * 二是如果用户删了其中的某个chain，再次打开时会重新添加，需求是如果用户删了(设置为可以删的)内置网络，再次打开时不会再次添加
 * 三是后续添加内置网络时候，会执行addAddressOfChainPipeline，这里面会调用xxPassword实例的getPassword方法，
 * 但是初始化时候，无论是memoryPassword的unlock页面还是interactivePassword的唤起输入框，都还没准备好，所以pipeline就直接跪了。
 * 所以需要一种机制来处理这种情况，在触发添加内置网络时候，先不进入正常流程而是唤起一个新的页面让输入密码，输入完成之后再进入正常流程。
 * 模拟后续增加网络，只需要注释掉以下其中一部分的情况下完成初始化，然后创建完第一个账户，再恢复注释并且Reload页面即可。
 */
(async () => {
  wallet.initPromise.then(() => {
    wallet.methods.addChain({ ...EthereumSepolia, type: EVMNetworkType });
    wallet.methods.addChain({ ...EthereumMainnet, type: EVMNetworkType });
    wallet.methods.addChain({ ...SolanaTestnet, type: SolanaNetworkType });
    wallet.methods.addChain({ ...SolanaMainnet, type: SolanaNetworkType });
    wallet.methods.addChain({ ...ConfluxTestnet, type: ConfluxNetworkType });
    wallet.methods.addChain({ ...ConfluxMainnet, type: ConfluxNetworkType });
  });
})();

export default wallet;