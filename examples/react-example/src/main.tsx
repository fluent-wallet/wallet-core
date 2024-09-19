import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store, Provider } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from './wallet';
import App from './App';

wallet.initPromise.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
});
