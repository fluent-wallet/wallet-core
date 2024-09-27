import { omit } from 'radash';
import { type RxDocument, type Database, type VaultType, type VaultDocTypeEnhance, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { decryptVaultValue } from './vaultEncryptor';
import { getTargetDocument } from '../../utils'

export const getVaultsCountOfType = async (database: Database, type: VaultType) => database.vaults.count({ selector: { type } }).exec();
export const getLastVaultAutoIndexOfType = async (database: Database, type: VaultType) =>
  database.vaults
    .findOne({ selector: { type }, sort: [{ autoIndex: 'desc' }] })
    .exec()
    .then((doc) => {
      if (!doc) return 0;
      return (doc as unknown as VaultDocTypeEnhance).autoIndex;
    });

export const generateDefaultVaultCode = (indexNumber: number) => {
  if (indexNumber >= 0 && indexNumber < 26) {
    return String.fromCharCode(65 + indexNumber);
  } else {
    return indexNumber - 25;
  }
};


export const getDecryptedVaultValue = (database: Database, vault: VaultDocType) => decryptVaultValue(database, vault.value);

export async function updateVault(database: Database, vaultData: Partial<VaultDocType> & { id: string }): Promise<RxDocument<VaultDocType>>;
export async function updateVault(database: Database, vaultId: string, vaultData: Partial<VaultDocType>): Promise<RxDocument<VaultDocType>>;
export async function updateVault(database: Database, vaultIdOrVault: Partial<VaultDocType> & { id: string } | string, vaultData?: Partial<VaultDocType>): Promise<RxDocument<VaultDocType>> {
  let vaultDocument: RxDocument<VaultDocType>;
  let _vaultData: Partial<VaultDocType>;


  if (typeof vaultIdOrVault === 'string') {
    vaultDocument = await getTargetDocument<VaultDocType>(database, 'vaults', vaultIdOrVault);
    if (!vaultData) {
      throw new Error('Account data must be provided when using accountId');
    }
    _vaultData = vaultData;
  } else {
    vaultDocument = await getTargetDocument<VaultDocType>(database, 'accounts', vaultIdOrVault.id);
    _vaultData = vaultIdOrVault;
  }

  return await vaultDocument.patch(omit(_vaultData, ['id', 'value', 'type', 'source']));
}
