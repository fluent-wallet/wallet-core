import { describe, expect, test } from 'vitest';

import { EVMChainMethodsClass, EvmMessageTypes } from './index';

describe('test evm chain', () => {
  test('default', () => {
    const ethereum = new EVMChainMethodsClass();
    expect(ethereum.hdPath).toMatchInlineSnapshot(`"m/44'/60'/0'/0/0"`);
  });

  test('isValidPrivateKey', () => {
    const ethereum = new EVMChainMethodsClass();

    expect(ethereum.isValidPrivateKey('0x')).toBe(false);
    expect(ethereum.isValidPrivateKey('0x123')).toBe(false);
    expect(ethereum.isValidPrivateKey('0x0123456789ABCDEF')).toBe(false);
    expect(ethereum.isValidPrivateKey('91d32f14656c8a60eef70389b6d904d1dd90cb3c41b0d35584ab372d1e2af627')).toBe(true);

    expect(ethereum.isValidPrivateKey('0x91d32f14656c8a60eef70389b6d904d1dd90cb3c41b0d35584ab372d1e2af627')).toBe(true);
  });

  test('isValidAddress', () => {
    const ethereum = new EVMChainMethodsClass();
    expect(ethereum.isValidAddress('0x')).toBe(false);
    expect(ethereum.isValidAddress('0x861db721D8B3F501d6CC1de85c5579Def881cEAe')).toBe(true);
    expect(ethereum.isValidAddress('0xAc41d0b666e65EEFfD35d01a4df10fcc7353D334')).toBe(true);
    expect(ethereum.isValidAddress('cfx:123')).toBe(false);
  });

  test('getDerivedFromMnemonic', () => {
    const ethereum = new EVMChainMethodsClass();
    const testMnemonic = 'test test test test test test test test test test test junk';
    expect(
      ethereum.getDerivedFromMnemonic({
        hdPath: ethereum.hdPath,
        mnemonic: testMnemonic,
        index: 0,
      }),
    ).toMatchInlineSnapshot(`
			{
			  "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
			  "publicAddress": "0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75",
			}
		`);

    expect(
      ethereum.getDerivedFromMnemonic({
        hdPath: ethereum.hdPath,
        mnemonic: testMnemonic,
        index: 1,
      }),
    ).toMatchInlineSnapshot(`
			{
			  "privateKey": "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
			  "publicAddress": "0x02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0",
			}
		`);
  });

  test('getAddressFromPrivateKey', () => {
    const ethereum = new EVMChainMethodsClass();

    expect(
      ethereum.getAddressFromPrivateKey({
        privateKey: '0x2631b846b570ccecfd320f55535a0c6c14b99e450daef3826001d8197747157b',
      }),
    ).toBe('0x861db721D8B3F501d6CC1de85c5579Def881cEAe');

    expect(
      ethereum.getAddressFromPrivateKey({
        privateKey: '0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e',
      }),
    ).toBe('0xAc41d0b666e65EEFfD35d01a4df10fcc7353D334');
  });

  test('getRandomPrivateKey', () => {
    const ethereum = new EVMChainMethodsClass();
    const privateKey = ethereum.getRandomPrivateKey();
    expect(ethereum.isValidPrivateKey(privateKey)).toBe(true);
  });

  test('signTransaction', async () => {
    const ethereum = new EVMChainMethodsClass();

    const tx = {};
    expect(
      await ethereum.signTransaction({
        privateKey: '0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e',
        data: {
          to: '0xAc41d0b666e65EEFfD35d01a4df10fcc7353D334',
          value: 0n,
          gas: 1n,
          gasPrice: 1n,
          nonce: 1,
          data: '0x',
        },
      }),
    ).toBe(
      '0xf85d01010194ac41d0b666e65eeffd35d01a4df10fcc7353d33480801ca07be576a58c0ae4f05ec467f1204fe32d889eb92f382c0a9786dd6c3d48798d31a07c689e10c51983280d9670c24ef81dda34e5b79efc72a8fa99c21c28ef8f1e22',
    );
  });

  test('signMessage', async () => {
    const ethereum = new EVMChainMethodsClass();
    const message = 'test';
    expect(
      await ethereum.signMessage({
        privateKey: '0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e',
        type: EvmMessageTypes.PERSONAL_SIGN,
        data: message,
      }),
    ).toBe('0xcf366c5c1641b2e5c3c6ee0a6752e41485557c52d773c1c45e8dcac59a5713687e89758731d81e1c9a4a22b72e3384e5d5bb68d74b9c4403950b3e9b4064ba091c');

    expect(
      await ethereum.signMessage({
        privateKey: '0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e',
        type: EvmMessageTypes.TYPE_DATA_V4,
        data: {
          primaryType: 'Mail',
          domain: {
            name: 'CFX Mail',
            version: '1',
            chainId: 1,
            verifyingContract: '0xAc41d0b666e65EEFfD35d01a4df10fcc7353D334',
          },
          types: {
            Person: [
              { name: 'name', type: 'string' },
              { name: 'wallet', type: 'address' },
            ],
            Mail: [
              { name: 'from', type: 'Person' },
              { name: 'to', type: 'Person' },
              { name: 'contents', type: 'string' },
            ],
          },
          message: {
            from: {
              name: 'Cow',
              wallet: '0xAc41d0b666e65EEFfD35d01a4df10fcc7353D334',
            },
            to: {
              name: 'Bob',
              wallet: '0xAc41d0b666e65EEFfD35d01a4df10fcc7353D334',
            },
            contents: 'Hello, Bob!',
          },
        },
      }),
    ).toBe('0xe8d5ad66b69737a3a01791472cc4fa23663b72377ba5548d9036f77c51cf629c05105609c76736d5755e6042a0e5bcfcefc93a41e09ff6dbd6fd7c7cec4495de1c');
  });
});
