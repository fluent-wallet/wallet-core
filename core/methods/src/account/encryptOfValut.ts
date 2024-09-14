import * as R from 'ramda';
export { validateMnemonic } from '@scure/bip39';
import { VaultTypeEnum, type Database } from '@cfx-kit/wallet-core-database/src';

export const encryptVaultValue = R.curry(async (database: Database, field: string, obj: any) => {
  const value = obj[field];
  const encryptedValue = typeof database.vaults.encrypt === 'function' ? await database.vaults.encrypt(value) : value;
  return {
    ...obj,
    [field]: encryptedValue,
  };
}) as <T extends Record<string, any>>(database: Database, field: keyof T, obj: T) => Promise<T>;

export const decryptVaultValue = async (database: Database, value: string) =>
  typeof database.vaults.decrypt === 'function' ? await database.vaults.decrypt<string>(value) : value;

type VaultNeedBeEncrypted = VaultTypeEnum.privateKey | VaultTypeEnum.mnemonic;
const getAllEncryptedVaultsOfType = async (database: Database, type: VaultNeedBeEncrypted) =>
  database.vaults
    .find({
      selector: {
        type,
      },
    })
    .exec();

export const isVaultExist = async (database: Database, { value, type }: { value: string; type: VaultNeedBeEncrypted }) =>
  getAllEncryptedVaultsOfType(database, type)
    .then((vaults) => Promise.all(vaults.map((vault) => decryptVaultValue(database, vault.value))))
    .then((values) => values.includes(value));
