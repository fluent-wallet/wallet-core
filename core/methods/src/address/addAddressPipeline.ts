import { VaultTypeEnum, type VaultType, type Database, type RxDocument, type AccountDocType, type ChainDocType, type VaultDocType, type AddressDocType } from '@cfx-kit/wallet-core-database/src';
import { type ChainsMap } from '../../../wallet/src';
import { decryptVaultValue } from '../accountSystem/vault/vaultEncryptor';


const writeAddressToDBWithChainAndAccount = async (database: Database, chainsMap: ChainsMap, { chains, accountsWithDecryptedVault }: {
  chains: Array<RxDocument<ChainDocType>>;
  accountsWithDecryptedVault: Array<{
    account: RxDocument<AccountDocType>;
    type: VaultType;
    value: string;
  }>
}) => {
  const addresses = chains.flatMap(chain =>
    accountsWithDecryptedVault.map(({ account, value, type }) => {
      const chainMethod = chainsMap[chain.type]!;
      let publicAddress: string;
      let privateKey: string;

      if (type === VaultTypeEnum.mnemonic) {
        ({ publicAddress, privateKey } = chainMethod.getDerivedFromMnemonic({ mnemonic: value, index: account.hdIndex, chainId: chain.chainId }));
      } else {
        if (chainMethod.isValidPrivateKey(value)) {
          publicAddress = chainMethod.getAddressFromPrivateKey({ privateKey: value });
          privateKey = value;
        } else {
          return null;
        }
      }

      return ({
        publicAddress,
        privateKey,
        account: account.id,
        chain: chain.id,
      });
    }).filter(Boolean) as Array<{ publicAddress: string; privateKey: string; account: string; chain: string; }>
  );

  const result = await database.addresses.bulkInsert(addresses as Array<AddressDocType>);

  const patchAccountsAndChains = result?.success?.map(async (address) => {
    const [account, chain] = await Promise.all(
      [
        address.populate('account') as Promise<RxDocument<AccountDocType>>,
        address.populate('chain') as Promise<RxDocument<ChainDocType>>
      ] as const
    );

    return await Promise.all([
      account.incrementalModify((accountDoc) => {
        accountDoc.addresses = [...(accountDoc.addresses ?? []), address.id];
        return accountDoc;
      }),
      chain.incrementalModify((chainDoc) => {
        chainDoc.addresses = [...(chainDoc.addresses ?? []), address.id];
        return chainDoc;
      }),
    ]);
  });

  const patchResult = await Promise.all(patchAccountsAndChains);
  return patchResult;
}


export const addAddressOfChainPipeline = async ({ database }: { database: Database }, chainsMap: ChainsMap) => database.chains.addPipeline({
  identifier: 'addAddressOfChainPipeline',
  destination: database.addresses,
  handler: async (chainsDoc) => {
    try {
      const vaultsNeedToAddAddress = await database.vaults.find({
        selector: {
          type: { $in: [VaultTypeEnum.mnemonic, VaultTypeEnum.privateKey] },
        },
      }).exec();
      if (!vaultsNeedToAddAddress.length) {
        return;
      }

      const chains = chainsDoc.filter((doc) => !doc.deleted && chainsMap[doc.type]).filter(chain => !chain.addresses || !chain.addresses.length);

      if (!chains.length) {
        return;
      }

      const accountsWithDecryptedVault = (await Promise.all(
        vaultsNeedToAddAddress.map(async (vault) =>
        ({
          type: vault.type,
          value: await decryptVaultValue({ database }, vault.value),
          accounts: await vault.populate('accounts') as Array<RxDocument<AccountDocType>>,
        })
        )
      )).flatMap(vault =>
        vault.accounts.map(account => ({
          account,
          type: vault.type,
          value: vault.value
        }))
      );

      await writeAddressToDBWithChainAndAccount(database, chainsMap, { chains, accountsWithDecryptedVault });
    } catch (error) {
      console.error('Failed to add address of chain pipleline: ', error);
    }
  }
});



export const addAddressOfAccountPipeline = async ({ database }: { database: Database }, chainsMap: ChainsMap) => database.accounts.addPipeline({
  identifier: 'addAddressOfAccountPipeline',
  destination: database.addresses,
  handler: async (accountsDoc) => {
    try {
      const chains = (await database.chains.find().exec()).filter((doc) => !doc.deleted && chainsMap[doc.type]);
      if (!chains.length) {
        return;
      }

      const accounts = accountsDoc.filter((doc) => !doc.deleted).filter(account => !account.addresses || !account.addresses.length);
      if (!accounts.length) {
        return;
      }

      const accountsWithDecryptedVault = await Promise.all(accounts.map(async (account) => {
        const vault = await account.populate('vault') as RxDocument<VaultDocType>;
        return {
          account,
          type: vault.type,
          value: await decryptVaultValue({ database }, vault.value),
        }
      }));

      await writeAddressToDBWithChainAndAccount(database, chainsMap, { chains, accountsWithDecryptedVault });
    } catch (error) {
      console.error('Failed to add address of account pipleline: ', error);
    }
  }
});


export const deleteAddressOfChainPipeline = async ({ database }: { database: Database }, chainsMap: ChainsMap) => database.chains.addPipeline({
  identifier: 'deleteAddressOfChainPipeline',
  destination: database.addresses,
  handler: async (chainsDoc) => {
    try {
      const deletedChains = chainsDoc.filter((doc) => doc.deleted);
      if (!deletedChains.length) {
        return;
      }

      const deletedAddresses = deletedChains.flatMap(chain => chain.addresses ?? []);
      if (!deletedAddresses.length) {
        return;
      }

      await database.addresses.bulkRemove(deletedAddresses);
    } catch (error) {
      console.error('Failed to delete address of chain pipleline: ', error);
    }
  }
});

export const deleteAddressOfAccountPipeline = async ({ database }: { database: Database }, chainsMap: ChainsMap) => database.accounts.addPipeline({
  identifier: 'deleteAddressOfAccountPipeline',
  destination: database.addresses,
  handler: async (accountsDoc) => {
    try {
      const deletedAccounts = accountsDoc.filter((doc) => doc.deleted);
      if (!deletedAccounts.length) {
        return;
      }

      const deletedAddresses = deletedAccounts.flatMap(account => account.addresses ?? []);
      if (!deletedAddresses.length) {
        return;
      }

      await database.addresses.bulkRemove(deletedAddresses);
    } catch (error) {
      console.error('Failed to delete address of account pipleline: ', error);
    }
  }
});