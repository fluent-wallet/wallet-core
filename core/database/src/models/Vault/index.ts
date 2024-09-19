import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const vaultSchemaLiteral = {
  version: 0,
  primaryKey: 'value',
  type: 'object',
  properties: {
    value: {
      type: 'string',
      maxLength: 128,
    },
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    isBackup: {
      type: 'boolean',
    },
    accounts: {
      type: 'array',
      ref: 'account',
      items: {
        type: 'string',
      },
    },
  },
  required: ['value', 'name', 'type', 'source', 'isBackup'],
  indexes: ['type'],
  options: {
    createAt: true,
  },
} as const;

export enum VaultTypeEnum {
  privateKey = 'privateKey',
  mnemonic = 'mnemonic',
  public = 'public',
  hardware = 'hardware',
  BSIM = 'BSIM',
}
export type VaultType = keyof typeof VaultTypeEnum;

export enum VaultSourceEnum {
  create = 'create',
  import = 'import',
}

export type VaultSource = keyof typeof VaultSourceEnum;

export interface Encryptor {
  encrypt: (value: any, password?: string) => Promise<string>;
  decrypt: <T = unknown>(encryptedDataString: string, password?: string) => Promise<T>;
}

export interface VaultCollectionMethods {
  encrypt?: Encryptor['encrypt'];
  decrypt?: Encryptor['decrypt'];
}

const schemaTyped = toTypedRxJsonSchema(vaultSchemaLiteral);
type _VaultDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export type VaultDocType = Overwrite<_VaultDocType, { source: VaultSource; type: VaultType }>;
export const vaultSchema: RxJsonSchema<VaultDocType> & { options: Record<string, any> } = vaultSchemaLiteral;
export type VaultCollection = RxCollection<VaultDocType, {}, VaultCollectionMethods>;

type Overwrite<T, U> = Omit<T, keyof U> & U;
