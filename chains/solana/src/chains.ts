export const SolanaNetworkType = 'Solana';

export const SolanaMainnet = {
  name: 'Solana Mainnet',
  endpoints: ['https://api.mainnet-beta.solana.co'],
  type: SolanaNetworkType,
  icon: 'https://github.com/trustwallet/assets/raw/master/blockchains/solana/info/logo.png',
  scanUrl: 'https://solscan.io',
  chainType: 'Mainnet',
};

export const SolanaTestnet = {
  name: 'Solana Testnet',
  endpoints: ['https://api.testnet.solana.com'],
  type: SolanaNetworkType,
  icon: 'https://github.com/trustwallet/assets/raw/master/blockchains/solana/info/logo.png',
  scanUrl: 'https://solscan.io/?cluster=testnet',
  chainType: 'Testnet',
};


export const SolanaDevnet = {
  name: 'Solana Devnet',
  endpoints: ['https://api.devnet.solana.com'],
  type: SolanaNetworkType,
  icon: 'https://github.com/trustwallet/assets/raw/master/blockchains/solana/info/logo.png',
  scanUrl: 'https://solscan.io/?cluster=devnet',
  chainType: 'Devnet',
};

