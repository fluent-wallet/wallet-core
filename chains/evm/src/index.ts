import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { generatePrivateKey, privateKeyToAddress, mnemonicToAccount, signTransaction as _signTransaction, signMessage as _signMessage, signTypedData } from 'viem/accounts';
import { isAddress } from 'viem';
export * from './chains';

export enum EvmMessageTypes {
  PERSONAL_SIGN = 'PERSONAL_SIGN',
  TYPE_DATA_V1 = 'TYPE_DATA_V1',
  TYPE_DATA_V3 = 'TYPE_DATA_V3',
  TYPE_DATA_V4 = 'TYPE_DATA_V4',
}

export default class EVMChainMethods extends ChainMethods {
  isValidPrivateKey(privateKey: string) {
    return typeof privateKey === 'string' && privateKey.startsWith('0x') && privateKey.length === 64;
  }

  isValidAddress(address: string) {
    return isAddress(address);
  }

  getDerivedPrivateKey({ mnemonic, hdPath = "m/44'/60'/0'/0/0", index }: { mnemonic: string; hdPath: string; index: number }) {
    const hdAccount = mnemonicToAccount(mnemonic, {
      path: hdPath.replace(/\d+$/, index.toString()) as `m/44'/60'/${string}`
    });
    const privateKey = hdAccount.getHdKey().privateKey;
    if (!privateKey) {
      throw new Error('Failed to derive private key');
    }
    return privateKey.toString();
  }

  getAddressFromPrivateKey({ privateKey }: { privateKey: string; }) {
    return privateKeyToAddress(privateKey as `0x${string}`);
  }

  getRandomPrivateKey() {
    return generatePrivateKey();
  }

  signTransaction({ privateKey, data }: { privateKey: string; data: Parameters<typeof _signTransaction>[0]['transaction']; }) {
    return _signTransaction({
      privateKey: privateKey as `0x${string}`,
      transaction: data
    });
  }

  signMessage(params: { privateKey: string; type: EvmMessageTypes.PERSONAL_SIGN; data: Parameters<typeof _signMessage>[0]['message'] }): ReturnType<typeof _signMessage>;
  signMessage(params: { privateKey: string; type: Omit<EvmMessageTypes, EvmMessageTypes.PERSONAL_SIGN>; } & Parameters<typeof signTypedData>[0]): ReturnType<typeof signTypedData>;
  signMessage({ privateKey, type, ...data }: { privateKey: string; type: EvmMessageTypes; } & any) {
    if (type === EvmMessageTypes.PERSONAL_SIGN) {
      return _signMessage({
        privateKey: privateKey as `0x${string}`,
        message: data
      });
    }

    return signTypedData({
      privateKey: privateKey as `0x${string}`,
      ...data
    })
  }
}