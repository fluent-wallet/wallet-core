import React from 'react';
import { createComponent } from '@lit/react';
import { useNavigate, useParams } from 'react-router-dom';
import { VerifyMnemonic } from 'common-web/dist';

export const BackupVerifyMnemonicBase = createComponent({
  react: React,
  tagName: 'backup-verify-mnemonic',
  elementClass: VerifyMnemonic,
  events: {
    onClickNextButton: 'backup-verify-mnemonic',
  },
});

export const BackupVerifyMnemonic = () => {
  const navigate = useNavigate();
  const { vaultId } = useParams();

  return (
    <BackupVerifyMnemonicBase

    />
  );
};
