import { useVaults } from '@cfx-kit/wallet-core-react-inject/src';
import { sendMessage } from '../messaging';
import wallet from './wallet';

const Vaults = () => {
  const vaults = useVaults();
  console.log(vaults);
  return <h2>valuts length: {Array.isArray(vaults) ? vaults?.length : -1}</h2>;
};

function IndexPopup() {
  return (
    <div>
      <Vaults />
      <button
        onClick={async () => {
          // wallet.methods.addMnemonicVault();
          sendMessage('addMnemonicVault', undefined);
        }}
      >
        addMnemonicVaultCreate
      </button>
      <button
        onClick={async () => {
          wallet.methods.addMnemonicVault('tag refuse output old identify oval major middle duck staff tube develop');
        }}
      >
        addMnemonicVaultImported
      </button>
    </div>
  );
}

export default IndexPopup;
