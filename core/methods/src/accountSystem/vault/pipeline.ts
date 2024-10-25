import { AccountDocType, Database, RxDocument, VaultDocType, VaultTypeEnum } from '@cfx-kit/wallet-core-database/src';
import { generateDefaultVaultCode, getLastVaultAutoIndexOfType } from './basic';

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const handleVaultDelete = async (database: Database, vaultsDoc: RxDocument<VaultDocType>[]) => {
  try {
    const deletedAccounts = vaultsDoc.filter((doc) => doc.deleted).flatMap((vault) => vault.accounts ?? []);

    if (!deletedAccounts.length) {
      return;
    }
    // await delay(5000);

    await database.accounts.bulkRemove(deletedAccounts);
  } catch (error) {
    console.error('Failed to delete accounts of vault: ', error);
  }
};

const handleVaultAdd = async (database: Database, vaultsDoc: RxDocument<VaultDocType>[]) => {
  try {
    const vaults = vaultsDoc.filter((doc) => !doc.deleted).filter((vault) => !vault.accounts || !vault.accounts.length);
    if (!vaults.length) {
      return;
    }
    // await delay(10000);

    const insertAccountsPromises = vaults.map(async (vault) => {
      const isPrivateKeyVault = vault.type === VaultTypeEnum.privateKey;
      let name: string;
      if (isPrivateKeyVault) {
        const lastIndex = await getLastVaultAutoIndexOfType({ database }, vault.type);
        name = `PrivateKey Account ${generateDefaultVaultCode(lastIndex - 1)}`;
      } else {
        name = `Account 1`;
      }

      return {
        hdIndex: 0,
        name,
        hidden: false,
        vault: vault.id,
      } as AccountDocType;
    });

    const insertAccounts = await Promise.all(insertAccountsPromises);
    const result = await database.accounts.bulkInsert(insertAccounts);
    const patchVaults = result?.success?.map(async (account) => {
      const vault = (await account.populate('vault')) as RxDocument<VaultDocType>;
      await vault.incrementalModify((vaultDoc) => {
        vaultDoc.accounts = [...(vaultDoc.accounts ?? []), account.id];
        return vaultDoc;
      });
    });
    await Promise.all(patchVaults);
  } catch (error) {
    console.error('Failed to add first account of vault: ', error);
  }
};

export const vaultToAccountPipeline = async ({ database }: { database: Database }) =>
  database.vaults.addPipeline({
    identifier: 'vaultToAccountPipeline',
    destination: database.pipeline,
    handler: async (vaultsDoc) => {
      await Promise.all([handleVaultAdd(database, vaultsDoc), handleVaultDelete(database, vaultsDoc)]);
    },
  });
