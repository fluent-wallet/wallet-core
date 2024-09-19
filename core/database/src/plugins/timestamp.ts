import type { RxPlugin } from 'rxdb';
const fieldsConfig = {
  createAt: { format: 'date-time', type: 'string', final: true, maxLength: 128, required: true, indexes: true },
  updatedAt: { format: 'date-time', type: 'string', maxLength: 128 },
};

const TimestampPlugin: RxPlugin = {
  name: 'timestamp',
  rxdb: true,
  overwritable: {},
  hooks: {
    preCreateRxSchema: {
      before: function (schema) {
        if (!schema || !schema.properties) {
          throw Error('schema must have a "properties" property');
        }
        const { options } = schema;
        Object.keys(fieldsConfig).forEach((key) => {
          if (options?.[key as keyof typeof options]) {
            const config = fieldsConfig[key as keyof typeof fieldsConfig];
            schema.required = schema.required ?? [];
            schema.indexes = schema.indexes ?? [];
            // @ts-ignore
            if (config.required) {
              schema.required = schema.required.concat(key);
            }
            // @ts-ignore
            if (config.indexes) {
              schema.indexes = schema.indexes.concat(key);
            }
            // @ts-ignore
            delete config.required;
            // @ts-ignore
            delete config.indexes;
            schema.properties[key] = config;
          }
        });
      },
    },
    createRxCollection: {
      before: function ({ collection }) {
        const options = collection.options;
        if (options?.createAt) {
          collection.preInsert((plainData) => (plainData.createAt = Date.now()), false);
        }
        if (options?.updatedAt) {
          collection.preSave((plainData) => (plainData.updatedAt = Date.now()), false);
        }
      },
    },
  },
};

export type EnhanceCreateAt<T> = T & { createAt: number };
export type RemoveCreateAt<T> = Omit<T, 'createAt'>;
export type EnhanceUpdatedAt<T> = T & { updatedAt: number };
export type RemoveUpdatedAt<T> = Omit<T, 'updatedAt'>;


export default TimestampPlugin;
