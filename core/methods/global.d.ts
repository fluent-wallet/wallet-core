import type { Database } from "@repo/database/src";

declare global {
  var database: Database;
  var waitForDatabaseInit: () => Promise<any>;
}

export {};
