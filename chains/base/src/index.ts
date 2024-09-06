abstract class ChainMethods {
    abstract isValidPrivateKey(privateKey: string): boolean;
    abstract isValidAddress(address: string): boolean;
    abstract isAddressEqual(address1: string, address2: string): boolean;
    abstract getDerivedPrivateKey(params: { mnemonic: string; hdPath: string; index: number }): string;
    abstract getAddressFromPrivateKey(privateKey: string): string;
    abstract getRandomPrivateKey?(): string;
    abstract signTransaction(params: { privateKey: string; data: any; }): Promise<any>;
    abstract signMessage?(params: { privateKey: string; data: any; }): Promise<string>;
  }
  
  export default ChainMethods;
  