import type { RxPlugin } from 'rxdb';
import { v4 as uuid } from 'uuid';
import { preCreateRxSchemaByConfig } from './utils';

const fieldsConfig = {
  id: { type: 'string', maxLength: 32 },
} as const;

const uniqueId: RxPlugin = {
  name: 'uniqueId',
  rxdb: true,
  overwritable: {},
  hooks: {
    preCreateRxSchema: preCreateRxSchemaByConfig(fieldsConfig),
    createRxCollection: {
      before: function ({ collection }) {
        const options = collection.options;
        if (options?.uniqueId) {
          collection.preInsert((plainData) => {
            plainData.id = uuid();
            return plainData;
          }, false);
        }
      },
    },
  },
};

export type EnhanceUniqueId<T> = T & { id: string };
export type RemoveUniqueId<T> = Omit<T, 'id'>;

export default uniqueId;
