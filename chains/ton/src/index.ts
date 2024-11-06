import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { keyPairFromSecretKey, keyPairFromSeed } from '@ton/crypto';
import slip10 from 'micro-key-producer/slip10.js';
import { mnemonicToSeedSync, generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import { Address } from '@ton/core';
import { WalletContractV4 } from '@ton/ton';

export default class TonChainMethodsClass extends ChainMethods {
  constructor(public hdPath: string = "m/44'/607'/0'/0'") {
    super(hdPath);
  }

  isValidPrivateKey(privateKey: string) {
    try {
      const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));
      return !!keyPair;
    } catch (error) {
      return false;
    }
  }

  isValidAddress(address: string): boolean {
    try {
      Address.parse(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  getDerivedFromMnemonic({ mnemonic, hdPath = this.hdPath, index }: { mnemonic: string; hdPath: string; index: number }) {
    const seed = mnemonicToSeedSync(mnemonic, ''); // (mnemonic, password)
    const hd = slip10.fromMasterSeed(seed);

    const hdResult = hd.derive(hdPath);
    if (!hdResult.privateKey) {
      throw new Error('Failed to derive private key');
    }
    const keypair = keyPairFromSeed(Buffer.from(hdResult.privateKey));
    const workchain = 0;
    const wallet = WalletContractV4.create({
      workchain,
      publicKey: keypair.publicKey,
    });
    return {
      privateKey: keypair.secretKey.toString('hex'),
      publicAddress: wallet.address.toString(),
    } as const;
  }

  getAddressFromPrivateKey({ privateKey }: { privateKey: string }) {
    const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });
    return wallet.address.toString();
  }

  getRandomPrivateKey() {
    const mnemonic = generateMnemonic(wordlist);
    const { privateKey } = this.getDerivedFromMnemonic({ mnemonic, hdPath: this.hdPath, index: 0 });
    return privateKey;
  }

  async signTransaction({ privateKey, data }: { privateKey: string; data: any }) {
    const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });
    return wallet.createTransfer({
      secretKey: keyPair.secretKey,
      ...data,
    });
  }
  isAddressEqual(address1: any, address2: any): boolean {
      try {
        const addr1 = Address.parse(address1);
        const addr2 = Address.parse(address2);
        return addr1.equals(addr2);
      } catch (error) {
        return false
      }

  }
}
