import { describe, expect, test } from 'vitest';
import { SolanaChainMethodsClass } from './index';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { createTransferCheckedInstruction } from '@solana/spl-token';

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

  test('signTransaction( send self sol)', async () => {
    const privateKey = '5KL9cTjjrEc8fJdkF56GAh6MZSrXkEViAr4C6wSkC6orv1VJBH7mi9gstEnTBRXTvEa9BkFBHZEq1doJ3xFRJAw8';
    const solana = new SolanaChainMethodsClass();
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const sendSol = SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: keypair.publicKey,
      lamports: 1000000000,
    });
    const tx = new Transaction();
    tx.add(sendSol);
    tx.recentBlockhash = 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N';

    expect(await solana.signTransaction({ data: tx, privateKey })).toMatchInlineSnapshot(
      `"013c45b0615b56bcf4189d485daeaf2eb3bd6f0cd2c2ebbc0ced396467b4395900d097ccd98b7e71da5ca1451719f9a022b7ac943af58e3b84344131492192ae0f010001026c359cfc035573d19a659d3f94d135dd8cd79c2f87fbb05c1b8f146ec9dba12f0000000000000000000000000000000000000000000000000000000000000000cc490e928cd2e3873bb343fc95da33179ca60f4dbf46c2c36e91299d55d4e6b901010200000c0200000000ca9a3b00000000"`,
    );
  });

  test('signTransaction( send self sol)', async () => {
    const privateKey = '5KL9cTjjrEc8fJdkF56GAh6MZSrXkEViAr4C6wSkC6orv1VJBH7mi9gstEnTBRXTvEa9BkFBHZEq1doJ3xFRJAw8';
    const solana = new SolanaChainMethodsClass();
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const sendSol = SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: keypair.publicKey,
      lamports: 1000000000,
    });
    const tx = new Transaction();
    tx.add(sendSol);
    tx.recentBlockhash = 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N';

    expect(await solana.signTransaction({ data: tx, privateKey })).toMatchInlineSnapshot(
      `"013c45b0615b56bcf4189d485daeaf2eb3bd6f0cd2c2ebbc0ced396467b4395900d097ccd98b7e71da5ca1451719f9a022b7ac943af58e3b84344131492192ae0f010001026c359cfc035573d19a659d3f94d135dd8cd79c2f87fbb05c1b8f146ec9dba12f0000000000000000000000000000000000000000000000000000000000000000cc490e928cd2e3873bb343fc95da33179ca60f4dbf46c2c36e91299d55d4e6b901010200000c0200000000ca9a3b00000000"`,
    );
  });

  test('signTransaction(send token)', async () => {
    const privateKey = '5KL9cTjjrEc8fJdkF56GAh6MZSrXkEViAr4C6wSkC6orv1VJBH7mi9gstEnTBRXTvEa9BkFBHZEq1doJ3xFRJAw8';
    const solana = new SolanaChainMethodsClass();
    const tokenAccountXPubkey = new PublicKey(
      "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
    );
    const alice = Keypair.fromSecretKey(
      bs58.decode(
        "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
      ),
    );
   
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const sendToken = createTransferCheckedInstruction(
      tokenAccountXPubkey,
      keypair.publicKey, 
      keypair.publicKey, 
      keypair.publicKey,
      1e8,
      1
    )
    const tx = new Transaction();
    tx.add(sendToken);
    tx.recentBlockhash = 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N';

    expect(await solana.signTransaction({ data: tx, privateKey })).toMatchInlineSnapshot(`"01682ddd780066d51ebdde3bf956297d27a8d04f500fa3d397f78e635903574e48c9ebf3ca4fd5eed2d0285e4af4bfd724eae880473bb9b43ae49c218b32c0780d010001036c359cfc035573d19a659d3f94d135dd8cd79c2f87fbb05c1b8f146ec9dba12f16aef79dfadb39ffedb3b6f77688b8c162b18bb9cba2ffefe152303629ae303006ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9cc490e928cd2e3873bb343fc95da33179ca60f4dbf46c2c36e91299d55d4e6b9010204010000000a0c00e1f5050000000001"`);
  });
});
