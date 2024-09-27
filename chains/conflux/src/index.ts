import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { generatePrivateKey, privateKeyToAddress, mnemonicToAccount, signTransaction as _signTransaction, signMessage as _signMessage, signTypedData } from 'cive/accounts';
import { isAddress } from "cive/utils";
export * from './chains';

export enum ConfluxMessageTypes {
  PERSONAL_SIGN = 'PERSONAL_SIGN',
  TYPE_DATA_V1 = 'TYPE_DATA_V1',
  TYPE_DATA_V3 = 'TYPE_DATA_V3',
  TYPE_DATA_V4 = 'TYPE_DATA_V4',
}

export class ConfluxChainMethodsClass extends ChainMethods {
  constructor(hdPath: string = "m/44'/503'/0'/0/0") {
    super(hdPath);
  }

  isValidPrivateKey(privateKey: string) {
    return typeof privateKey === 'string' && privateKey.startsWith('0x') && privateKey.length === 64;
  }

  isValidAddress(address: string) {
    return isAddress(address);
  }

  getDerivedPrivateKey({ mnemonic, hdPath = this.hdPath, index }: { mnemonic: string; hdPath: string; index: number }) {
    const hdAccount = mnemonicToAccount(mnemonic, {
      path: hdPath.replace(/\d+$/, index.toString()) as `m/44'/503'/${string}`,
      networkId: 1,
    });
    const privateKey = hdAccount.getHdKey().privateKey;
    if (!privateKey) {
      throw new Error('Failed to derive private key');
    }
    return privateKey.toString();
  }

  getAddressFromPrivateKey({ privateKey, networkId }: { privateKey: string; networkId: number }) {
    return privateKeyToAddress({ privateKey: privateKey as `0x${string}`, networkId });
  }

  getRandomPrivateKey() {
    return generatePrivateKey();
  }

  signTransaction({ privateKey, data }: { privateKey: string; data: Parameters<typeof _signTransaction>[0]['transaction']; }): ReturnType<typeof _signTransaction> {
    return _signTransaction({
      privateKey: privateKey as `0x${string}`,
      transaction: data
    });
  }

  signMessage(params: { privateKey: string; type: ConfluxMessageTypes.PERSONAL_SIGN; data: Parameters<typeof _signMessage>[0]['message'] }): ReturnType<typeof _signMessage>;
  signMessage(params: { privateKey: string; type: Omit<ConfluxMessageTypes, ConfluxMessageTypes.PERSONAL_SIGN>; } & Parameters<typeof signTypedData>[0]): ReturnType<typeof signTypedData>;
  signMessage({ privateKey, type, ...data }: { privateKey: string; type: ConfluxMessageTypes; } & any) {
    if (type === ConfluxMessageTypes.PERSONAL_SIGN) {
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

export default new ConfluxChainMethodsClass();