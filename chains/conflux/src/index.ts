import ChainMethod from '@cfx-kit/wallet-core-chain/src';

export default class EVMChainMethods extends ChainMethod {
    isValidAddress(address: string) {
        return true;
    }
  
}