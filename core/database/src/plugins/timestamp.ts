import type { RxPlugin } from 'rxdb';
import { preCreateRxSchemaByConfig } from './utils';

const fieldsConfig = {
  createAt: { type: 'string', final: true, maxLength: 16, required: true, indexes: true },
  updatedAt: { type: 'string', maxLength: 16 },
} as const;

const TimestampPlugin: RxPlugin = {
  name: 'timestamp',
  rxdb: true,
  overwritable: {},
  hooks: {
    preCreateRxSchema: preCreateRxSchemaByConfig(fieldsConfig),
    createRxCollection: {
      before: function ({ collection }) {
        const options = collection.options;
        if (options?.createAt) {
          collection.preInsert((plainData) => {
            plainData.createAt = String(Date.now());
            return plainData;
          }, false);
        }
        if (options?.updatedAt) {
          collection.preSave((plainData) => {
            plainData.updatedAt = String(Date.now());
            return plainData;
          }, false);
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
