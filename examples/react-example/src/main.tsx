import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store, Provider } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from './wallet.ts';
import App from './App';
console.log(wallet);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
