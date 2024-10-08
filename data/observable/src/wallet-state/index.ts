import { of, type Observable } from 'rxjs';
import { type State } from '@cfx-kit/wallet-core-database/src';

export const observePasswordInitialized = (state: State | undefined) =>
  !state ? of(undefined) : state.get$('encryptorContent') as Observable<string>;
