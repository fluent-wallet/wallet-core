import { useEffect } from 'react';
import { useVaults, useAccountsOfVault } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from './wallet';

const Accounts = ({ vaultId }: { vaultId: string }) => {
  const accounts = useAccountsOfVault(vaultId);
  // console.log(accounts?.map((account) => account.id));
  return (
    <div>
      {
        accounts?.map((account, index) => <div key={account.id} style={{ background: index % 2 === 0 ? 'blue' : 'yellow', height: 'fit-content', padding: 8 }}>
          <div>{account.name}</div>
        </div>)
      }
    </div>
  )
}

const Vaults = () => {
  const vaults = useVaults();
  return (
    <div>
      <h2>vaults length: {vaults?.length || 0}</h2>
      <div>
        {vaults?.map((vault, index) => <div key={vault.value} style={{ background: index % 2 === 0 ? 'red' : 'green', height: 'fit-content', marginTop: 20 }}>
          <div>{vault.name}
            <button onClick={() => wallet.methods.deleteVault(vault)}>delete vault</button>

          </div>
          <Accounts vaultId={vault.id} />
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
