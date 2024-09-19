import { useEffect } from 'react';
import { useVaults } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from './wallet';

const Vaults = () => {
  const vaults = useVaults();
  return (
    <div>
      <h2>vaults length: {vaults?.length || 0}</h2>
      <div>
        {vaults?.map((vault, index) => <div key={vault.value} style={{ background: index % 2 === 0 ? 'red' : 'green', height: 88 }}>
          <div>{vault.name}</div>
          <button onClick={() => wallet.methods.deleteVault(vault)}>delete</button>
        </div>)}
      </div>
    </div>

  )
}

function IndexPopup() {
  useEffect(() => {
    const func = async () => {
      wallet.methods.getVaultsCountOfType('mnemonic').then(res => {
        console.log('getVaultsCountOfType', res);
      }).catch(err => {
        console.log('Error getVaultsCountOfType', err);
      });
    }
    func();
  }, []);

  return (
    <div>
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
      <Vaults />
    </div>
  );
}

export default IndexPopup;
