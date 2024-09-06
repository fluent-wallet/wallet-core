import ChainMethod from '@cfx-kit/wallet-core-chain/src';
import { generatePrivateKey, privateKeyToAddress, mnemonicToAccount } from 'viem/accounts';
import { isAddress, isAddressEqual, type Address } from 'viem';

export default class EVMChainMethods extends ChainMethod {
    isValidPrivateKey(privateKey: string) {
        return typeof privateKey === 'string' && privateKey.startsWith('0x') && privateKey.length === 64;
    }

    isValidAddress(address: string) {
        return isAddress(address);
    }

    isAddressEqual(address1: any, address2: any) {
        if (typeof address1 !== 'string' || typeof address2 !== 'string' || !address1 || !address2) {
            return false;
        }
        return isAddressEqual(address1 as Address, address2 as Address);
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

    getAddressFromPrivateKey(privateKey: string) {
        return privateKeyToAddress(privateKey as `0x${string}`);
    }

    getRandomPrivateKey() {
        return generatePrivateKey();
    }
}