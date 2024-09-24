import { useEffect } from 'react';
import { useVaults, useAccountsOfVault } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from './wallet';

const Accounts = ({ vaultId }: { vaultId: string }) => {
  const accounts = useAccountsOfVault(vaultId);
  // console.log(vaultId, accounts);
  return (
    <div>
      {accounts?.map((account, index) => (
        <div key={account.id} style={{ background: index % 2 === 0 ? 'blue' : 'yellow', height: 'fit-content', padding: 8 }}>
          <div>{account.name}</div>
        </div>
      ))}
    </div>
  );
};

const Vaults = () => {
  const vaults = useVaults();
  // console.log('vaults', vaults);
  return (
    <div>
      <h2>vaults length: {vaults?.length || 0}</h2>
      <div>
        {vaults?.map((vault, index) => (
          <div key={vault.value} style={{ background: index % 2 === 0 ? 'red' : 'green', height: 'fit-content', marginTop: 20 }}>
            <div>
              {vault.name}
              <button onClick={() => wallet.methods.deleteVault(vault)}>delete vault</button>
              {vault.type === 'mnemonic' && <button onClick={() => wallet.methods.addAccountOfMnemonicVault(vault)}>add account</button>}
            </div>
            <Accounts vaultId={vault.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

function IndexPopup() {
  useEffect(() => {
    const func = async () => {
      wallet.methods
        .getVaultsCountOfType('mnemonic')
        .then((res) => {
          console.log('getVaultsCountOfType', res);
        })
        .catch((err) => {
          console.log('Error getVaultsCountOfType', err);
        });
    };
    func();
  }, []);

  return (
    <div>
      <button
        onClick={async () => {
          const showLog = false;
          const startTime = performance.now();
          showLog && console.log('Starting addMnemonicVault...');
          const addMnemonicStart = performance.now();
          await wallet.methods.addMnemonicVault();
          const addMnemonicEnd = performance.now();
          showLog && console.log(`addMnemonicVault completed in ${addMnemonicEnd - addMnemonicStart} ms`);

          console.log('Starting addAccountOfVault...');
          const addAccountStart = performance.now();
          await wallet.pipelines.addFirstAccountOfVault.awaitIdle();
          const addAccountEnd = performance.now();
          showLog && console.log(`addAccountOfVault completed in ${addAccountEnd - addAccountStart} ms`);

          const endTime = performance.now();
          showLog && console.log(`Total execution time: ${endTime - startTime} ms`);
        }}
      >
        add Random Mnemonic Vault
      </button>
      <button
        onClick={async () => {
          wallet.methods.addPrivateKeyVault({ privateKey: wallet.chains.Solana.getRandomPrivateKey(), source: 'create' });
        }}
      >
        add Random Solana PrivateKey Vault
      </button>
      <button
        onClick={async () => {
          wallet.methods.addMnemonicVault({ mnemonic: 'tag refuse output old identify oval major middle duck staff tube develop', source: 'import' });
        }}
      >
        add exist Mnemonic Vault
      </button>
      <Vaults />
    </div>
  );
}

export default IndexPopup;
