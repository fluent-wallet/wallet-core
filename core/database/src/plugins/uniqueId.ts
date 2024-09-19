import type { RxPlugin } from 'rxdb';
import { v4 as uuid } from 'uuid';

const fieldsConfig = {
  id: { type: 'string', final: true, maxLength: 32 },
};

const uniqueId: RxPlugin = {
  name: 'uniqueId',
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
            schema.properties[key] = fieldsConfig[key as keyof typeof fieldsConfig];
            schema.required = Array.from(new Set((schema.required ?? []).concat(key)));
            schema.indexes = Array.from(new Set((schema.indexes ?? []).concat(key)));
          }
        });
      },
    },
    createRxCollection: {
      before: function ({ collection }) {
        const options = collection.options;
        if (options?.uniqueId) {
          collection.preInsert((plainData) => (plainData.id = uuid()), false);
        }
      },
    },
  },
};

export type EnhanceUniqueId<T> = T & { id: string };
export type RemoveUniqueId<T> = Omit<T, 'id'>;

export default uniqueId;
