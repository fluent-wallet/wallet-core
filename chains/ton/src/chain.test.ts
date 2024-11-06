import { describe, test, expect } from 'vitest';
import { internal } from '@ton/ton';
import TonChainMethodsClass from './index';

const testPrivateKey = '0a7fdda8b17cf32723f386829f667c259d6d4aa239f3c1f24d733a5437503dce1958c7f819a6d7ec414219cbacedabaaea4e76da735c46f67a9376ea06fb66b9';

describe('test ton chain', () => {
  test('default', () => {
    const ton = new TonChainMethodsClass();
    expect(ton.hdPath).toMatchInlineSnapshot(`"m/44'/607'/0'/0'"`);
  });

  test('isValidPrivateKey', async () => {
    const ton = new TonChainMethodsClass();
    expect(ton.isValidPrivateKey(testPrivateKey)).toBe(true);
    expect(ton.isValidPrivateKey('0x')).toBe(false);
    expect(ton.isValidPrivateKey('0x123')).toBe(false);
    expect(ton.isValidPrivateKey('0x0123456789ABCDEF')).toBe(false);
  });

  test('isValidAddress', () => {
    const ton = new TonChainMethodsClass();
    expect(ton.isValidAddress('0x')).toBe(false);
    expect(ton.isValidAddress('0QAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4-QO')).toBe(true);
    expect(ton.isValidAddress('kQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi47nL')).toBe(true);
  });

  test('getDerivedFromMnemonic', () => {
    const ton = new TonChainMethodsClass();
    expect(
      ton.getDerivedFromMnemonic({ mnemonic: 'project drama album rail pink wife sunset such lizard evolve govern chaos fiction design lesson', hdPath: ton.hdPath, index: 0 }),
    ).toMatchInlineSnapshot(`
      {
        "privateKey": "f1cd031e8a2a212e781c6253f5c94936dd694dd6ab629024ca21f6beea266a8ece20c2c2013611197ed805a3276cd34710139b8633689ac6acbed6d36a486924",
        "publicAddress": "EQBG9kpVon0-qURmN6XP_t1_YvdT8qPZIJxR4mpd3XIZXWnr",
      }
    `);
  });

  test('getAddressFromPrivateKey', () => {
    const ton = new TonChainMethodsClass();
    expect(ton.getAddressFromPrivateKey({ privateKey: testPrivateKey })).toBe('EQBJKAri6EkHzEuwdpb86K9iL4JRA-nSpibLYyHfuJOmpZbJ');
  });

  test('getRandomPrivateKey', () => {
    const ton = new TonChainMethodsClass();
    expect(ton.isValidPrivateKey(ton.getRandomPrivateKey())).toBe(true);
  });

  test('transaction', async () => {
    const ton = new TonChainMethodsClass();

    const message = await ton.signTransaction({
      privateKey: testPrivateKey,
      data: {
        seqno: 1,
        messages: [
          internal({
            value: 1n,
            to: 'EQBJKAri6EkHzEuwdpb86K9iL4JRA-nSpibLYyHfuJOmpZbJ',
          }),
        ],
      },
    });

    expect(message).toBeDefined();
  });

  test('isAddressEqual', () => {
    const ton = new TonChainMethodsClass();
    expect(ton.isAddressEqual('EQBJKAri6EkHzEuwdpb86K9iL4JRA-nSpibLYyHfuJOmpZbJ', 'EQBJKAri6EkHzEuwdpb86K9iL4JRA-nSpibLYyHfuJOmpZbJ')).toBe(true);

    expect(ton.isAddressEqual('EQBJKAri6EkHzEuwdpb86K9iL4JRA-nSpibLYyHfuJOmpZbJ', 'EQBJKAri6EkHzEuwdpb86K9iL4JRA-aa')).toBe(false);
  });
});
