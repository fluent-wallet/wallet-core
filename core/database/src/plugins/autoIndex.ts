import type { RxPlugin } from 'rxdb';
const fieldsConfig = {
  autoIndex: { type: 'integer', final: true },
};

const autoIndex: RxPlugin = {
  name: 'autoIndex',
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
            schema.required = (schema.required ?? []).concat(key);
            schema.indexes = (schema.indexes ?? [])/* .concat(key) */;
          }
        });
      },
    },
    createRxCollection: {
      before: function ({ collection }) {
        const options = collection.options;
        if (options?.autoIndex) {
          collection.preInsert(async (plainData) => {
            const count = await collection.count().exec();
            plainData.autoIndex = count;
          }, false);
        }
      },
    },
  },
};

export default autoIndex;
