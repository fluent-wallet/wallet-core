import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const accountSchemaLiteral = {
  version: 0,
  primaryKey: {
    key: 'id',
    fields: ['vault', 'hdIndex'],
    separator: '-',
  },
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 36,
    },
    hdIndex: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    hidden: {
      type: 'boolean',
    },
    vault: {
      ref: 'vaults',
      type: 'string',
    },
    addresses: {
      type: 'array',
      ref: 'addresses',
      items: {
        type: 'string',
      },
    },
  },
  required: ['id', 'hdIndex', 'vault', 'name'],
} as const;

const schemaTyped = toTypedRxJsonSchema(accountSchemaLiteral);
export type AccountDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const accountSchema: RxJsonSchema<AccountDocType> = accountSchemaLiteral;
export type AccountCollection = RxCollection<AccountDocType>;
