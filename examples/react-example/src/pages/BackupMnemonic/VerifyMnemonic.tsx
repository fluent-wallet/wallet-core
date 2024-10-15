import React, { useEffect } from 'react';
import { createComponent } from '@lit/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VerifyMnemonic } from 'common-web/dist';
import { walletConfig } from '@wallet/index';

export const BackupVerifyMnemonicBase = createComponent({
  react: React,
  tagName: 'backup-verify-mnemonic',
  elementClass: VerifyMnemonic,
  events: {
    onSucess: 'onSucess',
    onFailed: 'onFailed',
    onClickSkipButton: 'onClickSkipButton',
  },
});

export const BackupVerifyMnemonic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mnemonic } = location.state ?? {};

  useEffect(() => {
    if (!mnemonic) {
      navigate('/initialize/backup/lose-tip');
    }
  }, [mnemonic]);

  return (
    <BackupVerifyMnemonicBase
      value={mnemonic}
      onSucess={() => navigate('/initialize/set-password', { state: { mnemonic, isBackup: true } })}
      onFailed={() => {
        alert(walletConfig.language === 'en' ? 'Mnemonic verification failed' : '助记词校验失败');
      }}
      onClickSkipButton={() => {
        navigate('/initialize/set-password', { state: { mnemonic } });
      }}
    />
  );
};
