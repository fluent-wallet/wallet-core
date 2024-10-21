import { bench, beforeAll } from "vitest";
import SolanaChainMethods, {
	SolanaNetworkType,
	SolanaTestnet,
	SolanaMainnet,
} from "../../../chains/solana/src";
import EVMChainMethods, {
	EVMNetworkType,
	EthereumSepolia,
	EthereumMainnet,
} from "../../../chains/evm/src";
import ConfluxChainMethods, {
	ConfluxNetworkType,
	ConfluxTestnet,
	ConfluxMainnet,
} from "../../../chains/conflux/src";

export const chains = {
	[EVMNetworkType]: EVMChainMethods,
	[SolanaNetworkType]: SolanaChainMethods,
	[ConfluxNetworkType]: ConfluxChainMethods,
};

const { wallet, jestInitPromise } = global.createNewWallet({
	encryptor: false,
	chains,
});

beforeAll(() => jestInitPromise);
/**
 * global.wallet registered ConfluxChain only.
 * see in `core/wallet/jest.setup.ts`.
 */
bench("addChain", async () => {
	await Promise.all(
		Array(10)
			.fill(null)
			.map(() => wallet.methods.addMnemonicVault()),
	);

	/** ----------------------------------- */

	await Promise.all([
		wallet.methods.addChain({ ...EthereumSepolia, type: EVMNetworkType }),
		wallet.methods.addChain({ ...EthereumMainnet, type: EVMNetworkType }),
		wallet.methods.addChain({ ...SolanaTestnet, type: SolanaNetworkType }),
		wallet.methods.addChain({ ...SolanaMainnet, type: SolanaNetworkType }),
		wallet.methods.addChain({ ...ConfluxTestnet, type: ConfluxNetworkType }),
		wallet.methods.addChain({ ...ConfluxMainnet, type: ConfluxNetworkType }),
	]);
	await wallet.pipelines.addAddressOfChain.awaitIdle();

	/** ----------------------------------- */

	await Promise.all(
		Array(20)
			.fill(null)
			.map(() => wallet.methods.addMnemonicVault()),
	);
	await wallet.pipelines.addAddressOfAccount.awaitIdle();
});
