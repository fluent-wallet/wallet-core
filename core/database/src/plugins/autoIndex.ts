import type { RxPlugin } from 'rxdb';
import { preCreateRxSchemaByConfig } from './utils';

const fieldsConfig = {
  autoIndex: { type: 'integer', final: true, minimum: 0, maximum: 99999, multipleOf: 1 },
} as const;

const autoIndex: RxPlugin = {
  name: 'autoIndex',
  rxdb: true,
  overwritable: {},
  hooks: {
    preCreateRxSchema: preCreateRxSchemaByConfig(fieldsConfig),
    createRxCollection: {
      before: function ({ collection }) {
        const options = collection.options;
        if (options?.autoIndex) {
          const isCollectionHasType = typeof options.autoIndex === 'string' && !!(collection as any)?.schema.jsonSchema?.properties?.[options.autoIndex];

          collection.preInsert(async (plainData) => {
            const isDocumentHasType = typeof options.autoIndex === 'string' && !!plainData?.[options.autoIndex];
            const lastIndex: number = await collection
              .findOne({
                sort: [{ autoIndex: 'desc' }],
                ...(isCollectionHasType && isDocumentHasType ? { selector: { [options.autoIndex]: plainData[options.autoIndex] } } : undefined),
              })
              .exec()
              .then((doc) => (!doc ? 0 : doc.autoIndex));
            plainData.autoIndex = lastIndex + 1;
            return plainData;
          }, false);
        }
      },
    },
  },
};

export type EnhanceAutoIndex<T> = T & { autoIndex: number };
export type RemoveAutoIndex<T> = Omit<T, 'autoIndex'>;

export default autoIndex;
