import { VaultTypeEnum, type VaultType, type Database, type RxDocument, type AccountDocType, type ChainDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
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
        ({ publicAddress, privateKey } = chainMethod.getDerivedFromMnemonic({ mnemonic: value, index: account.hdIndex }));
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
  console.log('addresses', addresses);
  const result = await database.addresses.bulkInsert(addresses);
  const patchAccountsAndChains = result?.success?.map(async (address) => {
    const [account, chain] = await Promise.all(
      [
        address.populate('account') as Promise<RxDocument<AccountDocType>>,
        address.populate('chain') as Promise<RxDocument<ChainDocType>>
      ] as const
    );

    await Promise.all([
      account.patch({
        addresses: [...(account.addresses ?? []), address.publicAddress],
      }),
      chain.patch({
        addresses: [...(account.addresses ?? []), address.publicAddress],
      }),
    ]);
  });

  await Promise.all(patchAccountsAndChains);
}


export const addAddressOfChainPipleline = async (database: Database, chainsMap: ChainsMap) => database.chains.addPipeline({
  identifier: 'addAddressOfChainPipleline',
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

      const newChains = chainsDoc.filter((doc) => !doc.deleted && chainsMap[doc.type]);
      const accountsWithDecryptedVault = (await Promise.all(
        vaultsNeedToAddAddress.map(async (vault) =>
        ({
          type: vault.type,
          value: await decryptVaultValue(database, vault.value),
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

      await writeAddressToDBWithChainAndAccount(database, chainsMap, { chains: newChains, accountsWithDecryptedVault });
    } catch (error) {
      console.error('Failed to add address of chain pipleline: ', error);
    }
  }
});



export const addAddressOfAccountPipleline = async (database: Database, chainsMap: ChainsMap) => database.accounts.addPipeline({
  identifier: 'addAddressOfAccountPipleline',
  destination: database.addresses,
  handler: async (accountsDoc) => {
    try {
      const chains = (await database.chains.find().exec()).filter((doc) => !doc.deleted && chainsMap[doc.type]);
      if (!chains.length) {
        return;
      }
      console.log('chains', chains);
      const newAccounts = accountsDoc.filter((doc) => !doc.deleted);
      console.log('newAccounts', newAccounts);

      const accountsWithDecryptedVault = await Promise.all(newAccounts.map(async (account) => {
        const vault = await account.populate('vault') as RxDocument<VaultDocType>;
        return {
          account,
          type: vault.type,
          value: await decryptVaultValue(database, vault.value),
        }
      }));
      console.log('accountsWithDecryptedVault', accountsWithDecryptedVault);

      await writeAddressToDBWithChainAndAccount(database, chainsMap, { chains, accountsWithDecryptedVault });
    } catch (error) {
      console.error('Failed to add address of account pipleline: ', error);
    }
  }
});