import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const addressSchemaLiteral = {
  version: 0,
  primaryKey: {
    key: 'id',
    fields: ['chain', 'account', 'publicAddress'],
    separator: '|',
  },
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 256,
    },
    publicAddress: {
      type: 'string',
      maxLength: 128,
    },
    privateKey: {
      type: 'string',
      maxLength: 128,
    },
    account: {
      ref: 'accounts',
      type: 'string',
    },
    chain: {
      ref: 'chains',
      type: 'string',
    },
  },
  required: ['id', 'publicAddress', 'account', 'chain'],
} as const;

const schemaTyped = toTypedRxJsonSchema(addressSchemaLiteral);
export type AddressDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const addressSchema: RxJsonSchema<AddressDocType> = addressSchemaLiteral;
export type AddressCollection = RxCollection<AddressDocType>;
