import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store, Provider } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from '@wallet/index';
import Router from '@router/index';
import 'common-web/dist';

wallet.initPromise.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {/* @ts-ignore */}
      <Provider store={store}>
        <Router />
      </Provider>
    </StrictMode>,
  );
});
