import { describe, expect, test } from 'vitest';
import { SolanaChainMethodsClass } from './index';

describe('test solana chain', () => {
  test('default', () => {
    const solana = new SolanaChainMethodsClass();
    expect(solana.hdPath).toMatchInlineSnapshot(`"m/44'/501'/0'/0/0"`);
  });

  test('isValidPrivateKey', () => {
    const fakePrivateKey = '5KL9cTjjrEc8fJdkF56GAh6MZSrXkEViAr4C6wSkC6orv1VJBH7mi9gstEnTBRXTvEa9BkFBHZEq1doJ3xFRJAw8';
    const solana = new SolanaChainMethodsClass();
    expect(solana.isValidPrivateKey(fakePrivateKey)).toBe(true);
  });

  test('getDerivedFromMnemonic', () => {
    const solana = new SolanaChainMethodsClass();
    const testMnemonic = 'test test test test test test test test test test test junk';
    expect(
      solana.getDerivedFromMnemonic({
        hdPath: solana.hdPath,
        mnemonic: testMnemonic,
        index: 0,
      }),
    ).toMatchInlineSnapshot(`
			{
			  "privateKey": "5KL9cTjjrEc8fJdkF56GAh6MZSrXkEViAr4C6wSkC6orv1VJBH7mi9gstEnTBRXTvEa9BkFBHZEq1doJ3xFRJAw8",
			  "publicAddress": "8HQSwFhWGPCLCCaQ2SwCn5ze5qKJhVTyhTvfFRPEfoKc",
			}
		`);
  });
  test('getAddressFromPrivateKey', () => {
    const solana = new SolanaChainMethodsClass();
    expect(
      solana.getAddressFromPrivateKey({
        privateKey: '5KL9cTjjrEc8fJdkF56GAh6MZSrXkEViAr4C6wSkC6orv1VJBH7mi9gstEnTBRXTvEa9BkFBHZEq1doJ3xFRJAw8',
      }),
    ).toMatchInlineSnapshot(`"8HQSwFhWGPCLCCaQ2SwCn5ze5qKJhVTyhTvfFRPEfoKc"`);
  });
  test('getRandomPrivateKey', () => {
    const solana = new SolanaChainMethodsClass();
    const privateKey = solana.getRandomPrivateKey();
    expect(solana.isValidPrivateKey(privateKey)).toBe(true);
  });
});
