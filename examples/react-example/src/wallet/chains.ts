import EVMChainMethods, { EVMNetworkType, EthereumSepolia, EthereumMainnet } from '../../../../chains/evm/src';
import SolanaChainMethods, { SolanaNetworkType, SolanaTestnet, SolanaMainnet } from '../../../../chains/solana/src';
import ConfluxChainMethods, { ConfluxNetworkType, ConfluxTestnet, ConfluxMainnet } from '../../../../chains/conflux/src';
export const chains = {
  [EVMNetworkType]: EVMChainMethods,
  [SolanaNetworkType]: SolanaChainMethods,
  [ConfluxNetworkType]: ConfluxChainMethods,
};

export {
  EVMNetworkType,
  SolanaNetworkType,
  ConfluxNetworkType,
  EthereumSepolia,
  EthereumMainnet,
  SolanaTestnet,
  SolanaMainnet,
  ConfluxTestnet,
  ConfluxMainnet,
}
