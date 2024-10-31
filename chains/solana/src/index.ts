import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
export * from './chains';

export class SolanaChainMethodsClass extends ChainMethods {
  constructor(hdPath: string = "m/44'/501'/0'/0/0") {
    super(hdPath);
  }

  isValidPrivateKey(privateKey: string) {
    try {
      bs58.decode(privateKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  isValidAddress(address: string) {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  getDerivedFromMnemonic({ mnemonic, hdPath = this.hdPath, index }: { mnemonic: string; hdPath: string; index: number }) {
    const seed = mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
    const hd = HDKey.fromMasterSeed(seed);

    const hdResult = hd.derive(hdPath.replace(/\d+$/, index.toString()));
    if (!hdResult.privateKey) {
      throw new Error('Failed to derive private key');
    }
    const keypair = Keypair.fromSeed(hdResult.privateKey);
    return {
      privateKey: bs58.encode(keypair.secretKey),
      publicAddress: keypair.publicKey.toBase58()
    } as const;
  }

  getAddressFromPrivateKey({ privateKey }: { privateKey: string; }) {
    return Keypair.fromSecretKey(bs58.decode(privateKey)).publicKey.toString();
  }

  getRandomPrivateKey() {
    return bs58.encode(Keypair.generate().secretKey);
  }

  async signTransaction({ privateKey, data }: { privateKey: string; data: Parameters<typeof SystemProgram['transfer']>[0]; }) {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        ...data,
        fromPubkey: keypair.publicKey,
      })
    );
    transaction.sign(keypair);
    return transaction.serialize().toString();
  }
}

export default new SolanaChainMethodsClass();