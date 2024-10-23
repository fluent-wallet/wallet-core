import { toTypedRxJsonSchema, type RxCollection, type ExtractDocumentTypeFromTypedRxJsonSchema, type RxJsonSchema } from 'rxdb';

const pipelineSchemaLiteral = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 64,
    },
  },
  required: ['id'],
} as const;

const schemaTyped = toTypedRxJsonSchema(pipelineSchemaLiteral);
export type PipelineDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const pipelineSchema: RxJsonSchema<PipelineDocType> = pipelineSchemaLiteral;
export type PipelineCollection = RxCollection<PipelineDocType>;
