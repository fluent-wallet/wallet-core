import * as R from 'ramda';
import { addChain } from './addChain';
import { UniquePrimaryKeyError } from '../utils/MethodError';
import { ConfluxMainnet, ConfluxTestnet } from './../../../../chains/conflux/src/chains';
import { SolanaMainnet } from './../../../../chains/solana/src/chains';

const { wallet } = global.createNewWallet({ encryptor: 'Memory' });
beforeAll(() => wallet.initPromise);

describe('addChain Test', () => {
  test('add a chain', async () => {
    const chainData = await addChain(wallet.database, ConfluxMainnet);
    expect(chainData).toEqual(expect.objectContaining(ConfluxMainnet));
    // chainId should be auto combine from type and chainId
    expect(chainData.id).toBe(`${ConfluxMainnet.type}|${ConfluxMainnet.chainId}`);
  });

  test('add a exist chain should throw UniquePrimaryKeyError', async () => {
    expect(addChain(wallet.database, ConfluxMainnet)).rejects.toThrow(UniquePrimaryKeyError);
  });

  test('add a chain with a single endpoint', async () => {
    const convertEndpointsToEndpoint = R.converge(R.assoc('endpoint'), [R.pipe(R.prop('endpoints'), R.head), R.dissoc('endpoints')]) as any;
    const chainData = await addChain(wallet.database, convertEndpointsToEndpoint(ConfluxTestnet));
    expect(chainData).toEqual(expect.objectContaining(ConfluxTestnet));
    expect(chainData.endpoints).toEqual(ConfluxTestnet.endpoints);
  });

  test('add a chain without chainId', async () => {
    const chainData = await addChain(wallet.database, SolanaMainnet);
    expect(chainData).toEqual(expect.objectContaining(SolanaMainnet));

    expect(chainData.chainId).toBe(SolanaMainnet.endpoints[0]);
    expect(chainData.id).toBe(`${SolanaMainnet.type}|${SolanaMainnet.endpoints[0]}`);
  });
});
