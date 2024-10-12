import React, { useEffect } from 'react';
import { createComponent } from '@lit/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShowMnemonic } from 'common-web/dist';
import { useVaultFromId } from '@cfx-kit/wallet-core-react-inject/src';

export const BackupShowMnemonicBase = createComponent({
  react: React,
  tagName: 'backup-show-mnemonic',
  elementClass: ShowMnemonic,
  events: {
    onClickNextButton: 'onClickNextButton',
    onClickCloseButton: 'onClickCloseButton',
  },
});

export const BackupShowMnemonic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vaultId } = useParams();
  const vault = useVaultFromId(vaultId);

  /**
   * In initial's backup flow, if user directly access this page by url,
   * there is no random generated mnemonic yet, we need to redirect user to lose-tip page.
   * And generate a new mnemonic when click next button.
   * Of course, another option is to generate the random mnemonic on this page mount,
   * but this would result in a new mnemonic being generated every time the user enters this page,
   * which is not a good user experience.
   */
  useEffect(() => {
    if (vaultId) return;

    if (!location.state) {
      navigate('/backup/lose-tip');
    }
  }, [vaultId, location.state]);

  const hasNextFlow = (!vaultId && location.state) || (vaultId && vault?.type === 'mnemonic' && !vault.isBackup);
  console.log('vaultId', vaultId);
  return (
    <BackupShowMnemonicBase
      showNextButton={hasNextFlow}
      showCloseButton={!hasNextFlow}
      onClickNextButton={() => navigate(vaultId ? `/backup/${vaultId}/verify-mnemonic` : '/initialize/backup/verify-mnemonic', { state: { mnemonic: location.state?.value } })}
      onClickCloseButton={() => navigate('/wallet')}
      type={vaultId ? (vault!.type as 'mnemonic' | 'privateKey') : 'mnemonic'}
      value={location.state?.value}
    />
  );
};
