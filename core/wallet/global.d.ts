import type { Database } from "@cfx-kit/wallet-core-database/src";
import type { Wallet } from "./jest.setup";

declare global {
  var database: Database;
  var waitForDatabaseInit: () => Promise<any>;
  var wallet: Wallet;
}

export {};
