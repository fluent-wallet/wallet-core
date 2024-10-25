import { omit } from 'radash';
import { type Database, type RxDocument, type AccountDocType, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { getTargetDocument, NoDocumentError } from '../../utils'

export const getVaultOfAccount = ({ database }: { database: Database }, accountIdorAccount: AccountDocType | string) =>
  database.accounts
    .findOne(typeof accountIdorAccount === 'string' ? accountIdorAccount : accountIdorAccount.id)
    .exec()
    .then(async (account) => {
      if (!account) {
        throw new NoDocumentError(`Account with id ${typeof accountIdorAccount === 'string' ? accountIdorAccount : accountIdorAccount.id} not found in database`);
      }
      const vault = (await account?.populate('vault')) as RxDocument<VaultDocType>;
      return vault;
    });


export async function updateAccount({ database }: { database: Database }, accountData: Partial<AccountDocType> & { id: string }): Promise<RxDocument<AccountDocType>>;
export async function updateAccount({ database }: { database: Database }, accountId: string, accountData: Partial<AccountDocType>): Promise<RxDocument<AccountDocType>>;
export async function updateAccount({ database }: { database: Database }, accountIdorAccount: Partial<AccountDocType> & { id: string } | string, accountData?: Partial<AccountDocType>): Promise<RxDocument<AccountDocType>> {
  let accountDocument: RxDocument<AccountDocType>;
  let _accountData: Partial<AccountDocType>;

  if (typeof accountIdorAccount === 'string') {
    accountDocument = await getTargetDocument<AccountDocType>(database, 'accounts', accountIdorAccount);
    if (!accountData) {
      throw new Error('Account data must be provided when using accountId');
    }
    _accountData = accountData;
  } else {
    accountDocument = await getTargetDocument<AccountDocType>(database, 'accounts', accountIdorAccount.id);
    _accountData = accountIdorAccount;
  }

  return await accountDocument.patch(omit(_accountData, ['id', 'hdIndex', 'vault']));
}
