import type { RxPluginHooks } from 'rxdb';

type FieldsConfig = Record<
  string,
  {
    property?: string;
    format?: string;
    type: 'integer' | 'string' | 'number' | 'boolean';
    maxLength?: number;
    final?: boolean;
    required?: boolean;
    indexes?: boolean;
  }
>;

export const preCreateRxSchemaByConfig = (fieldsConfig: FieldsConfig) => {
  return {
    before: function (schema) {
      if (!schema || !schema.properties) {
        throw Error('schema must have a "properties" property');
      }
      const { options } = schema;
      if (!options) return;
      Object.keys(fieldsConfig).forEach((fieldKey) => {
        if (!options[fieldKey]) return;
        const field = fieldsConfig[fieldKey as keyof typeof fieldsConfig]!;
        const propertyName = field.property ?? fieldKey;
        schema.required = schema.required ?? [];
        schema.indexes = schema.indexes ?? [];
        if (field.required && !schema.required.includes(propertyName)) {
          schema.required = schema.required.concat(propertyName);
        }

        if (field.indexes && !schema.indexes.includes(propertyName)) {
          schema.indexes = schema.indexes.concat(propertyName);
        }
        schema.properties[propertyName] = {
          type: field.type,
          ...(field.final ? { final: true } : null),
          ...(field.maxLength ? { maxLength: field.maxLength } : null),
          ...(field.format ? { format: field.format } : null),
        };
      });
    },
  } as RxPluginHooks<any>;
};
