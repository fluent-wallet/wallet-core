import { describe, expect, test } from "vitest";

import { ConfluxChainMethodsClass, ConfluxMessageTypes } from "./index";

describe("test conflux core space chain", () => {
	test("default", () => {
		const conflux = new ConfluxChainMethodsClass();
		expect(conflux.hdPath).toMatchInlineSnapshot(`"m/44'/503'/0'/0/0"`);
	});

	test("isValidPrivateKey", () => {
		const conflux = new ConfluxChainMethodsClass();

		expect(conflux.isValidPrivateKey("0x")).toBe(false);
		expect(conflux.isValidPrivateKey("0x123")).toBe(false);
		expect(conflux.isValidPrivateKey("0x0123456789ABCDEF")).toBe(false);
		expect(
			conflux.isValidPrivateKey(
				"91d32f14656c8a60eef70389b6d904d1dd90cb3c41b0d35584ab372d1e2af627",
			),
		).toBe(true);

		expect(
			conflux.isValidPrivateKey(
				"0x91d32f14656c8a60eef70389b6d904d1dd90cb3c41b0d35584ab372d1e2af627",
			),
		).toBe(true);
	});

	test("isValidAddress", () => {
		const conflux = new ConfluxChainMethodsClass();
		expect(conflux.isValidAddress("0x")).toBe(false);
		expect(
			conflux.isValidAddress("cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2"),
		).toBe(true);
		expect(
			conflux.isValidAddress(
				"cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fd23ge3cbyw",
			),
		).toBe(true);
		expect(conflux.isValidAddress("cfx:123")).toBe(false);
	});

	test("getDerivedFromMnemonic", () => {
		const conflux = new ConfluxChainMethodsClass();
		const testMnemonic =
			"test test test test test test test test test test test junk";
		expect(
			conflux.getDerivedFromMnemonic({
				hdPath: conflux.hdPath,
				mnemonic: testMnemonic,
				index: 0,
				chainId: "1111",
			}),
		).toMatchInlineSnapshot(`
			{
			  "privateKey": "0x2631b846b570ccecfd320f55535a0c6c14b99e450daef3826001d8197747157b",
			  "publicAddress": "net1111:aanb5r3b5c39mas03us8u1czthttvassz2t8r0ykhr",
			}
		`);

		expect(
			conflux.getDerivedFromMnemonic({
				hdPath: conflux.hdPath,
				mnemonic: testMnemonic,
				index: 1,
				chainId: "1111",
			}),
		).toMatchInlineSnapshot(`
			{
			  "privateKey": "0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e",
			  "publicAddress": "net1111:aasedyf0p5xf7597g1jbyxtvb9ghgy8xgu466pk5md",
			}
		`);
	});

	test("getAddressFromPrivateKey", () => {
		const conflux = new ConfluxChainMethodsClass();

		expect(
			conflux.getAddressFromPrivateKey({
				privateKey:
					"0x2631b846b570ccecfd320f55535a0c6c14b99e450daef3826001d8197747157b",
				networkId: 1111,
			}),
		).toBe("net1111:aanb5r3b5c39mas03us8u1czthttvassz2t8r0ykhr");

		expect(
			conflux.getAddressFromPrivateKey({
				privateKey:
					"0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e",
				networkId: 1111,
			}),
		).toBe("net1111:aasedyf0p5xf7597g1jbyxtvb9ghgy8xgu466pk5md");
	});

	test("getRandomPrivateKey", () => {
		const conflux = new ConfluxChainMethodsClass();
		const privateKey = conflux.getRandomPrivateKey();
		expect(conflux.isValidPrivateKey(privateKey)).toBe(true);
	});

	test("signTransaction", async () => {
		const conflux = new ConfluxChainMethodsClass();

		const tx = {};
		expect(
			await conflux.signTransaction({
				privateKey:
					"0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e",
				data: {
					to: "cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2",
					value: 0n,
					gas: 1n,
					gasPrice: 1n,
					nonce: 1,
					data: "0x",
				},
			}),
		).toBe(
			"0xf861dd0101019410cf798816d4b9b9866b5330eea46a18382f251e808080018001a05977e0de950eb3701f3f6c656f147d5da5568978e6e3e3046ea6e45605176287a011bf07f2832edc1a5e1d1792c70617d0bda58fa5c0f40cd273b173b1c55eb583",
		);
	});

	test("signMessage", async () => {
		const conflux = new ConfluxChainMethodsClass();
		const message = "test";
		expect(
			await conflux.signMessage({
				privateKey:
					"0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e",
				type: ConfluxMessageTypes.PERSONAL_SIGN,
				data: message,
			}),
		).toBe(
			"0xf186d94c4d3a10746844f3db03a8ccdd4ed27fbc6374bd39b0aafb0d42f3ee36332d4db0eb3c0b329b4fd2bb0730830dc2a1d29940fa40128e3864dcb160694c01",
		);

		expect(
			await conflux.signMessage({
				privateKey:
					"0x682f1871b21d18e03a0dd6e04f6c67945712f30241401cea076332d0221d251e",
				type: ConfluxMessageTypes.TYPE_DATA_V4,
				data: {
					primaryType: "Mail",
					domain: {
						name: "CFX Mail",
						version: "1",
						chainId: 1,
						verifyingContract: "cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2",
					},
					types: {
						Person: [
							{ name: "name", type: "string" },
							{ name: "wallet", type: "address" },
						],
						Mail: [
							{ name: "from", type: "Person" },
							{ name: "to", type: "Person" },
							{ name: "contents", type: "string" },
						],
					},
					message: {
						from: {
							name: "Cow",
							wallet: "cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2",
						},
						to: {
							name: "Bob",
							wallet: "cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2",
						},
						contents: "Hello, Bob!",
					},
				},
			}),
		).toBe(
			"0x469a5c6c9b8c630d04edb4f8083e82881e717b2dfbd970bb2720faf768cb65c241dae944c67d330d2563aeb2d48a3dc05fca85e8f0fc09157bcdc97247b8226f01",
		);
	});
});
