import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const accountSchemaLiteral = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 32,
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
      ref: 'vault',
      type: 'string',
    },
  },
  required: ['id', 'name', 'vault'],
} as const;

const schemaTyped = toTypedRxJsonSchema(accountSchemaLiteral);
export type AccountDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const accountSchema: RxJsonSchema<AccountDocType> = accountSchemaLiteral;
export type AccountCollection = RxCollection<AccountDocType>;