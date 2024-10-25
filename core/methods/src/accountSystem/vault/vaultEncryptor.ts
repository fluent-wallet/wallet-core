import { type Database } from '@cfx-kit/wallet-core-database/src';

export const encryptVaultValue = async ({ database }: { database: Database }, value: string) =>
  typeof database.vaults.encrypt === 'function' ? await database.vaults.encrypt(value) : value;

export const decryptVaultValue = async ({ database }: { database: Database }, value: string) =>
  typeof database.vaults.decrypt === 'function' ? await database.vaults.decrypt<string>(value) : value;

type VaultNeedBeEncrypted = 'privateKey' | 'mnemonic';
const getAllEncryptedVaultsOfType = async ({ database }: { database: Database }, type: VaultNeedBeEncrypted) =>
  database.vaults
    .find({
      selector: {
        type,
      },
    })
    .exec();

export const isVaultExist = async ({ database }: { database: Database }, { value, type }: { value: string; type: VaultNeedBeEncrypted }) =>
  getAllEncryptedVaultsOfType({ database }, type)
    .then((vaults) => Promise.all(vaults.map((vault) => decryptVaultValue({ database }, vault.value))))
    .then((values) => values.includes(value));
