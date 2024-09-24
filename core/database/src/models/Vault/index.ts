import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';
import { type EnhanceAutoIndex } from '../../plugins/autoIndex';

const vaultSchemaLiteral = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 32
    },
    value: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
      maxLength: 32,
      final: true,
    },
    source: {
      type: 'string',
      final: true,
    },
    isBackup: {
      type: 'boolean',
    },
    accounts: {
      type: 'array',
      ref: 'accounts',
      items: {
        type: 'string',
      },
    },
  },
  required: ['id', 'value', 'name', 'type', 'source', 'isBackup'],
  indexes: ['type'],
  options: {
    autoIndex: 'type',
    uniqueId: true,
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
export type VaultDocTypeEnhance = EnhanceAutoIndex<VaultDocType>;
export const vaultSchema: RxJsonSchema<VaultDocType> & { options: Record<string, any> } = vaultSchemaLiteral;
export type VaultCollection = RxCollection<VaultDocType, {}, VaultCollectionMethods>;

type Overwrite<T, U> = Omit<T, keyof U> & U;
