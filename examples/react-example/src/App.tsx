import { useEffect } from 'react';
import { useVaults } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from './wallet';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/src/mechanism/Encryptor/Password/InteractivePassword';

const Vaults = () => {
  const vaults = useVaults();
  // console.log(vaults);
  return <h2>valuts length: {Array.isArray(vaults) ? vaults?.length : -1}</h2>;
};

function IndexPopup() {
  useEffect(() => {
    async function example() {
      const interactivePassword = new InteractivePassword({
        cacheTime: 5
      });
      const sub = interactivePassword.passwordRequest$.subscribe((request) => {
        request.resolve('test-password')
        sub.unsubscribe();
      });
      const firstPromise = interactivePassword.getPassword();
      const password1 = await firstPromise;
      console.log('password1:', password1);
  
      await new Promise((resolve) => setTimeout(resolve, 10));
      const secondPromise = interactivePassword.getPassword();
      const password2 = await secondPromise;
      console.log('password2:', password2);

      // try {
      //   // Simulate multiple simultaneous calls
      //   const password1 = interactivePassword.getPassword();
      //   const password2 = interactivePassword.getPassword();
      //   console.log('Are passwords promise the same?', password1 === password2, password1, password2);
      //   console.log('Password 1:', await password1);
        
      //   setTimeout(async () => {
      //     const cachedPassword = await interactivePassword.getPassword();
      //     console.log('password twice:', cachedPassword);
      //   }, 1000);
      //   const cachedPassword = await interactivePassword.getPassword();
      //   console.log('Cached password:', cachedPassword);
      // } catch (error) {
      //   console.error('Error:', error);
      // }
    }
    example();
  }, []);

  return (
    <div>
      <Vaults />
      <button
        onClick={async () => {
          wallet.methods.addMnemonicVault();
        }}
      >
        addMnemonicVaultCreate
      </button>
      <button
        onClick={async () => {
          wallet.methods.addMnemonicVault({ mnemonic: 'tag refuse output old identify oval major middle duck staff tube develop', source: 'import' });
        }}
      >
        addMnemonicVaultImported
      </button>
    </div>
  );
}

export default IndexPopup;
