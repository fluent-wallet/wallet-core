import type { Database } from "@cfx-kit/wallet-core-database/src";

declare global {
  var database: Database;
  var waitForDatabaseInit: () => Promise<any>;
}

export {};
