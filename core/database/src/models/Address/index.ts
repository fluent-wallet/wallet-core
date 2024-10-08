import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const addressSchemaLiteral = {
  version: 0,
  primaryKey: 'publicAddress',
  type: 'object',
  properties: {
    publicAddress: {
      type: 'string',
      maxLength: 128,
    },
    privateKey: {
      type: 'string',
      maxLength: 128,
      final: true,
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
  required: ['publicAddress', 'account', 'chain'],
} as const;

const schemaTyped = toTypedRxJsonSchema(addressSchemaLiteral);
export type AddressDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const addressSchema: RxJsonSchema<AddressDocType> = addressSchemaLiteral;
export type AddressCollection = RxCollection<AddressDocType>;
