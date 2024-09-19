import { type Database } from "@cfx-kit/wallet-core-database/src";
import { type AccountDocType } from "@cfx-kit/wallet-core-database/src/models/Account";

export const accountsOfVault = (database: Database) => {
  database.vaults.addPipeline({
    identifier: 'accountsOfVault',
    destination: database.accounts,
    handler: async (vaultsDoc) => {
      const insertAccounts = vaultsDoc.filter((doc) => !doc.deleted).map((vault, index) => ({
        hdIndex: 0,
        name: 'default' + ' ' + index,
        hidden: false,
        vault: vault.value,
      }) as AccountDocType);
      // database.accounts.bulkInsert(insertAccounts);
    }
  });
}