abstract class ChainMethods {
  hdPath: string;
  abstract isValidPrivateKey(privateKey: string): boolean;
  abstract isValidAddress(address: string): boolean;
  abstract getDerivedPrivateKey(params: { mnemonic: string; hdPath?: string; index: number }): string;
  abstract getAddressFromPrivateKey({ privateKey }: { privateKey: string }): string;
  abstract getRandomPrivateKey?(): string;
  abstract signTransaction(params: { privateKey: string; data: any }): Promise<any>;

  constructor(hdPath: string) {
    this.hdPath = hdPath;
  }

  signMessage?(params: { privateKey: string; data: any }): Promise<string>;

  isAddressEqual(address1: any, address2: any) {
    if (typeof address1 !== 'string' || typeof address2 !== 'string' || !address1 || !address2) {
      return false;
    }
    return address1.toLowerCase() === address2.toLowerCase();
  }
}

// export default ChainMethods;
export { ChainMethods };
