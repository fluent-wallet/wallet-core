import { useVaults } from '@cfx-kit/wallet-core-react-inject/src';
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
