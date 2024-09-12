export const EVMNetworkType = 'EVM';

export const EthereumMainnet = {
  name: 'Ethereum Mainnet',
  endpoints: ['https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'],
  networkType: EVMNetworkType,
  chainId: '0x1',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Ethereum.svg',
  scanUrl: 'https://etherscan.io',
  builtin: true,
  chainType: 'Mainnet',
};


export const EthereumSepolia = {
  name: 'Ethereum Sepolia',
  endpoints: ['https://sepolia.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'],
  networkType: EVMNetworkType,
  chainId: '0xaa36a7',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Ethereum.svg',
  scanUrl: 'https://sepolia.etherscan.io',
  chainType: 'Testnet',
};


export const ConfluxESpace = {
  name: 'Conflux eSpace',
  endpoints: ['https://evm.confluxrpc.com/1BvViQet4km8KPALkc6Pa9'],
  networkType: EVMNetworkType,
  chainId: '0x406',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Conflux.svg',
  scanUrl: 'https://evm.confluxscan.io',
  chainType: 'Mainnet',
};


export const ConfluxESpaceTestnet = {
  name: 'Conflux eSpace Testnet',
  endpoints: ['https://test.confluxrpc.com/1BvViQet4km8KPALkc6Pa9'],
  networkType: EVMNetworkType,
  chainId: '0x47',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Conflux.svg',
  scanUrl: 'https://evmtestnet.confluxscan.io',
  chainType: 'Testnet',
};

export const ConfluxESpace8889 = {
  name: 'Conflux eSpace 8889',
  endpoints: ['https://net8889eth.confluxrpc.com/'],
  networkType: EVMNetworkType,
  chainId: '0x406',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Conflux.svg',
  scanUrl: 'https://net8889eth.confluxscan.net',
  chainType: 'Devnet',
};

