export const ConfluxNetworkType = 'Conflux';

export const ConfluxMainnet = {
  name: 'Conflux Mainnet',
  endpoints: ['https://main.confluxrpc.com/1BvViQet4km8KPALkc6Pa9'],
  type: ConfluxNetworkType,
  chainId: '0x405',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Conflux.svg',
  scanUrl: 'https://confluxscan.io',
  chainType: 'Mainnet',
};

export const ConfluxTestnet = {
  name: 'Conflux Testnet',
  endpoints: ['https://test.confluxrpc.com/1BvViQet4km8KPALkc6Pa9'],
  type: ConfluxNetworkType,
  chainId: '0x1',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Conflux.svg',
  scanUrl: 'https://testnet.confluxscan.io',
  chainType: 'Testnet',
};



export const Conflux8888 = {
  name: 'Conflux 8888',
  endpoints: ['https://net8888cfx.confluxrpc.com'],
  type: ConfluxNetworkType,
  chainId: '0x22b8',
  icon: 'https://cdn.jsdelivr.net/gh/Conflux-Chain/helios@dev/packages/built-in-network-icons/Conflux.svg',
  scanUrl: 'https://net8888cfx.confluxscan.net',
  chainType: 'Devnet',
};