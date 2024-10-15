import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export function useObservableState<T>(observable: Observable<T>, initialState: T): T {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const subscription = observable.subscribe(value => {
      setState(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable]);

  return state;
}