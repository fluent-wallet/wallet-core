import { ConfluxMainnet } from './../../../../chains/conflux/src/chains';
import { SolanaMainnet } from './../../../../chains/solana/src/chains';
import { ProtectError } from '../../../methods/src/utils/MethodError';
import ConfluxChainMethods, { ConfluxNetworkType, ConfluxChainMethodsClass } from '../../../../chains/conflux/src';
const chains = {
  [ConfluxNetworkType]: ConfluxChainMethods,
  ['custom-Conflux']: new ConfluxChainMethodsClass(`m/44'/50333'/0'/0/0`),
};


const { wallet, jestInitPromise } = global.createNewWallet({ encryptor: 'Memory', chains });
beforeAll(() => jestInitPromise);
/** 
 * global.wallet registered ConfluxChain only.
 * see in `core/wallet/jest.setup.ts`.
 */
describe('addChain', () => {
  test('add a registered chain', async () => {
    const chainData = await wallet.methods.addChain(ConfluxMainnet);
    expect(chainData).toEqual(expect.objectContaining(ConfluxMainnet),);
  });

  test('add a not registered chain should throw ProtectError', async () => {
    expect(() => wallet.methods.addChain(SolanaMainnet)).toThrow(ProtectError);
  });
});
