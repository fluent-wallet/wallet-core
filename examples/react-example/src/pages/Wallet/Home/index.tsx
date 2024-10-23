import { useEffect, useState, useRef, Suspense } from 'react';
import { useVaults, useAccountsOfVault } from '@cfx-kit/wallet-core-react-inject/src';
import wallet from '@wallet/index';

const Account = ({ account }: { account: NonNullable<ReturnType<typeof useAccountsOfVault>>[number] }) => {
  const [inEdit, setInEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null!);

  return (
    <div>
      {inEdit ? <input ref={inputRef} defaultValue={account.name} /> : account.name}
      <button
        style={{ marginLeft: 8 }}
        onClick={async () => {
          if (inEdit) {
            await wallet.methods.updateAccount(account.id, { name: inputRef.current.value || account.name });
          }
          setInEdit((pre) => !pre);
        }}
      >
        {inEdit ? 'save' : 'edit'}
      </button>
      <button style={{ marginLeft: 8 }} onClick={() => wallet.methods.deleteAccount(account)}>
        delete account
      </button>
    </div>
  );
};

const Accounts = ({ vaultId }: { vaultId: string }) => {
  const accounts = useAccountsOfVault(vaultId);

  return (
    <div>
      {accounts?.map((account, index) => (
        <div key={account.id} style={{ background: index % 2 === 0 ? 'gray' : 'yellow', height: 'fit-content', padding: 8 }}>
          <Account account={account} />
        </div>
      ))}
    </div>
  );
};

const Vault = ({ vault }: { vault: NonNullable<ReturnType<typeof useVaults>>[number] }) => {
  const [inEdit, setInEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null!);

  return (
    <>
      <div>
        {inEdit ? <input ref={inputRef} defaultValue={vault.name} /> : vault.name}
        {vault.type === 'mnemonic' && (
          <button
            style={{ marginLeft: 8 }}
            onClick={() => {
              wallet.methods.addAccountOfMnemonicVault(vault);
            }}
          >
            add account
          </button>
        )}
        <button
          style={{ marginLeft: 8 }}
          onClick={async () => {
            if (inEdit) {
              await wallet.methods.updateVault(vault.id, { name: inputRef.current.value || vault.name });
            }
            setInEdit((pre) => !pre);
          }}
        >
          {inEdit ? 'save' : 'edit'}
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => {
            wallet.methods.deleteVault(vault);
          }}
        >
          delete vault
        </button>
      </div>
      <Accounts vaultId={vault.id} />
    </>
  );
};

const VaultsContent = () => {
  const vaults = useVaults();
  // console.log('vaults', vaults);
  return (
    <div>
      <h2>vaults length: {vaults?.length || 0}</h2>
      <div>
        {vaults?.map((vault, index) => (
          <div key={vault.value} style={{ background: index % 2 === 0 ? 'red' : 'lightblue', height: 'fit-content', marginTop: 20 }}>
            <Vault vault={vault} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Vaults = () => {
  return (
    <Suspense fallback={null}>
      <VaultsContent />
    </Suspense>
  );
};

export function WalletHome() {
  const [visible, setVisible] = useState(false);
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

  const addRandomMnemonicVault = async () => {
    const showLog = true;
    const startTime = performance.now();
    showLog && console.log('Starting addMnemonicVault...');
    const addMnemonicStart = performance.now();
    await wallet.methods.addMnemonicVault();
    const addMnemonicEnd = performance.now();
    showLog && console.log(`addMnemonicVault completed in ${addMnemonicEnd - addMnemonicStart} ms`);

    showLog && console.log('Starting addAccountOfVault...');
    const addAccountStart = performance.now();
    await wallet.pipelines.vaultToAccount.awaitIdle();
    await wallet.pipelines.addAddressOfAccount.awaitIdle();
    const addAccountEnd = performance.now();
    showLog && console.log(`addAccountOfVault completed in ${addAccountEnd - addAccountStart} ms`);

    const endTime = performance.now();
    showLog && console.log(`Total execution time: ${endTime - startTime} ms`);
  };

  return (
    <div>
      <button onClick={addRandomMnemonicVault}>add Random Mnemonic Vault</button>
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
      <button onClick={() => setVisible((v) => !v)}>toggle</button>
      {visible && <Vaults />}
    </div>
  );
}
