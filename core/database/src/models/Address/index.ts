import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const addressSchemaLiteral = {
  version: 0,
  primaryKey: 'value',
  type: 'object',
  properties: {
    value: {
      type: 'string',
      maxLength: 64,
    },
    account: {
      ref: 'account',
      type: 'string',
    },
    hdPath: {
      ref: 'hdPath',
      type: 'string',
    },
  },
  required: ['value', 'account'],
} as const;

const schemaTyped = toTypedRxJsonSchema(addressSchemaLiteral);
export type AddressDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const addressSchema: RxJsonSchema<AddressDocType> = addressSchemaLiteral;
export type AddressCollection = RxCollection<AddressDocType>;
