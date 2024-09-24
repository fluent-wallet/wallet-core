import { type Database, type VaultType, type VaultDocTypeEnhance, type VaultDocType } from '@cfx-kit/wallet-core-database/src';
import { decryptVaultValue } from './vaultEncryptor';

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
    return String(indexNumber - 26) + 1;
  }
};

export const getDecryptedVaultValue = (database: Database, vault: VaultDocType) => decryptVaultValue(database, vault.value);
