import * as R from 'ramda';
import { RxError } from 'rxdb';
import { UniquePrimaryKeyError, type MethodError } from './MethodError';

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
