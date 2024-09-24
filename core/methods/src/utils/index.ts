import * as R from 'ramda';
import { RxError, type Database, type RxDocument, type DeepReadonly } from '@cfx-kit/wallet-core-database/src';
import { UniquePrimaryKeyError, ParamsError, NoDocumentError, type MethodError } from './MethodError';
export * from './MethodError';

const createIsSpecificError = (regStr: string) => R.test(new RegExp(regStr));
const createIsRxError = (err: any) => err instanceof RxError;
const createWrapWithCustomErrorHandling = R.curry(
  (isSpecificError: (err: any) => boolean, customError: MethodError) =>
    <F extends (...args: any[]) => Promise<any>>(fn: F): F =>
      ((...args: Parameters<F>) =>
        fn(...args).catch(err =>
          Promise.reject(isSpecificError(err) ? customError : err)
        )
      ) as F
);

export const handleUniquePrimaryKeyError = createWrapWithCustomErrorHandling(createIsRxError, new UniquePrimaryKeyError());


export const getTargetDocument = async <T extends { id: string }>(database: Database, collection: keyof Database['collections'], targetIdOrTarget: string | T | DeepReadonly<T>) => {
  const targetId = typeof targetIdOrTarget === 'string' ? targetIdOrTarget : targetIdOrTarget?.id;
  if (!targetId) {
    return Promise.reject(new ParamsError('Invalid target or id.'));
  }

  const targetDocument = await database[collection].findOne(targetId).exec();
  if (!targetDocument) {
    return Promise.reject(new NoDocumentError(`No ${collection.endsWith('s') ? collection.slice(0, -1) : collection.endsWith('es') ? collection.slice(0, -2) : collection} found in the database.`));
  }

  return targetDocument as unknown as RxDocument<T>;
};
