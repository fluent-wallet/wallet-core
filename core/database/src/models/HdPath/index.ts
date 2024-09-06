import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const hdPathSchemaLiteral = {
  version: 0,
  primaryKey: 'value',
  type: 'object',
  properties: {
    value: {
      type: 'string',
      maxLength: 32,
    },
    chain: {
      ref: 'chain',
      type: 'string',
      maxLength: 64,
    },
    addresses: {
      type: 'array',
      ref: 'address',
      items: {
        type: 'string',
      },
    },
  },
  required: ['value'],
  indexes: ['chain'],
} as const;

const schemaTyped = toTypedRxJsonSchema(hdPathSchemaLiteral);
export type HdPathDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const hdPathSchema: RxJsonSchema<HdPathDocType> = hdPathSchemaLiteral;
export type HdPathCollection = RxCollection<HdPathDocType>;
