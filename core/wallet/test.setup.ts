import { randomUUID } from "crypto";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import WalletClass from "./src";
import Encryptor from "./src/mechanism/Encryptor";
import InteractivePassword from "./src/mechanism/Encryptor/Password/InteractivePassword";
import MemoryPassword from "./src/mechanism/Encryptor/Password/MemoryPassword";
import methods from "../methods/src/allMethods";

export const createNewWallet = ({
	encryptor = "Memory",
	dbName = randomUUID(),
	chains,
}: {
	encryptor: "Interactive" | "Memory" | false;
	dbName?: string;
	chains: WalletClass["chains"];
}) => {
	const password =
		encryptor === "Memory" ? new MemoryPassword() : new InteractivePassword();

	const wallet = new WalletClass<typeof methods>({
		chains,
		methods,
		databaseOptions: {
			dbName,
			storage: getRxStorageMemory(),
			encryptor: encryptor
				? new Encryptor(password.getPassword.bind(password))
				: undefined,
		},
	});

	const jestInitPromise = wallet.initPromise.then(() => {
		wallet.methods.initPassword("12345678");
	});

	if (password instanceof MemoryPassword) {
		password.setPassword("12345678");

		return {
			wallet,
			jestInitPromise,
		} as const;
	}

	return {
		wallet,
		jestInitPromise,
	} as const;
};

global.createNewWallet = createNewWallet;
