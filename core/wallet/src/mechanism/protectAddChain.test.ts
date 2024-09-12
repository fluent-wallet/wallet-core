import { ConfluxMainnet } from './../../../../chains/conflux/src/chains';
import { SolanaMainnet } from './../../../../chains/solana/src/chains';
import { ProtectError } from '../../../methods/src/utils/MethodError';

beforeAll(global.waitForDatabaseInit);

/** 
 * global.wallet registered ConfluxChain only.
 * see in `core/wallet/jest.setup.ts`.
 */
describe('addChain', () => {
  test('add a registered chain', async () => {
    const chainData = await global.wallet.methods.addChain(ConfluxMainnet);
    expect(chainData).toEqual(expect.objectContaining(ConfluxMainnet),);
  });

  test('add a not registered chain should throw ProtectError', async () => {
    expect(() => global.wallet.methods.addChain(SolanaMainnet)).toThrow(ProtectError);
  });
});
