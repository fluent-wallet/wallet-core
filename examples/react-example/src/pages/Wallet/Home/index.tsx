import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useVaults, useAccountsOfVault, useCurrentAccount } from '@cfx-kit/wallet-core-react-inject/src';
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
      <button style={{ marginLeft: 8 }} onClick={async () => {
        const a =   await wallet.methods.setCurrentAccount(account);
        console.log('set currentAccount', a);
      }}>
        set current account
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
  const [visible, setVisible] = useState(true);
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

  const addRandomMnemonicVault = useCallback(async () => {
    await wallet.methods.addMnemonicVault();
    await wallet.pipelines.vaultToAccount.awaitIdle();
    await wallet.pipelines.addAddressOfAccount.awaitIdle();
  }, []);


  const currentAccount = useCurrentAccount();

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


      <div>
        <h2>current account: {currentAccount?.name}</h2>
        <button onClick={() => wallet.methods.setCurrentAccount(null)}>set current account to null</button>
      </div>
      {visible && <Vaults />}
    </div>
  );
}
