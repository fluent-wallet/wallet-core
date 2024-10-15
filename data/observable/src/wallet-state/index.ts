import { of, map, type Observable } from 'rxjs';
import { type State } from '@cfx-kit/wallet-core-database/src';

export const observePasswordInitialized = (state: State | undefined) =>
  !state ? of(false) : (state.get$('encryptorContent') as Observable<string>).pipe(
    map((encryptorContent) => !!encryptorContent),
  );

