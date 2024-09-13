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
    type: {
      type: 'string',
    },
    privateKeyType: {
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
  required: ['value', 'type', 'source', 'isBackup'],
  options: {
    autoIndex: true,
    createAt: true,
    updatedAt: true,
  },
} as const;

export enum VaultTypeEnum {
  privateKey = 'privateKey',
  mnemonic = 'mnemonic',
  public = 'public',
  hardware = 'hardware',
  BSIM = 'BSIM',
}
type VaultType = keyof typeof VaultTypeEnum;

export enum PrivateKeyTypeEnum {
  secp256k1 = 'secp256k1',
  ed25519Hex32 = 'ed25519Hex32',
  ed25519Base58 = 'ed25519Base58',
}
type PrivateKeyType = keyof typeof PrivateKeyTypeEnum;

export enum VaultSourceEnum {
  create = 'create',
  import = 'import',
}
type VaultSource = keyof typeof VaultSourceEnum;

type Overwrite<T, U> = Omit<T, keyof U> & U;

const schemaTyped = toTypedRxJsonSchema(vaultSchemaLiteral);
type _VaultDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export type VaultDocType = Overwrite<_VaultDocType, { source: VaultSource; type: VaultType; privateKeyType?: PrivateKeyType; }>;
export const vaultSchema: RxJsonSchema<VaultDocType> & { options: Record<string, any> } = vaultSchemaLiteral;
export type VaultCollection = RxCollection<VaultDocType>;
