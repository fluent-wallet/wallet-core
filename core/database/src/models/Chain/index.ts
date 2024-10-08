import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const chainSchemaLiteral = {
  version: 0,
  primaryKey: {
    key: 'id',
    fields: ['type', 'chainId'],
    separator: '|',
  },
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 64,
    },
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
      maxLength: 32,
    },
    chainId: {
      type: 'string',
      maxLength: 32,
    },
    endpoints: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    icon: {
      type: 'string',
    },
    scanUrl: {
      type: 'string',
    },
    chainType: {
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
  required: ['id', 'name', 'type', 'chainId', 'endpoints', 'icon', 'scanUrl', 'chainType'],
  indexes: ['type'],
} as const;

const schemaTyped = toTypedRxJsonSchema(chainSchemaLiteral);
export type ChainDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const chainSchema: RxJsonSchema<ChainDocType> = chainSchemaLiteral;
export type ChainCollection = RxCollection<ChainDocType>;
