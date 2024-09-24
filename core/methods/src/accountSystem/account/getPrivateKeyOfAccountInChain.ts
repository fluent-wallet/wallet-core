import { VaultTypeEnum, type Database, type AccountDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { ChainMethods } from '../../../../../chains/base/src';
import { NoDocumentError } from '../../utils/MethodError';

export const getPrivateKeyOfAccountInChain = (
  database: Database,
  { account, getDerivedPrivateKey }: { account: AccountDocType; getDerivedPrivateKey: ChainMethods['getDerivedPrivateKey'] },
) =>
  database.accounts
    .findOne(account.id)
    .exec()
    .then(async (accountDoc) => {
      if (!accountDoc) {
        throw new NoDocumentError(`Account with id ${account.id} not found in database`);
      }
      const vault = (await accountDoc?.populate('vault')) as VaultDocType;
      return { vault, account: accountDoc };
    })
    .then(({ vault, account }) => {
      if (vault.type === VaultTypeEnum.mnemonic) {
        return getDerivedPrivateKey({
          mnemonic: vault.value,
          index: account.hdIndex,
        });
      } else if (vault.type === VaultTypeEnum.privateKey) {
        return vault.value;
      } else {
        throw new Error('Unsupported vault type');
      }
    });
