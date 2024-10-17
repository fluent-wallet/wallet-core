abstract class ChainMethods {
  hdPath: string;
  abstract isValidPrivateKey(privateKey: string): boolean;
  abstract isValidAddress(address: string): boolean;
  abstract getDerivedFromMnemonic(params: { mnemonic: string; hdPath?: string; index: number; chainId?: string }): { privateKey: string; publicAddress: string };
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

/**
 * TODO:
 * 判断如果当前环境支持webWorker，则使用webWorker来执行chainMethods里的方法，否则使用主线程执行。
 * */

// export default ChainMethods;
export { ChainMethods };
