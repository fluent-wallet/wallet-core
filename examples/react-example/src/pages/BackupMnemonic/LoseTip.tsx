import React from 'react';
import { createComponent } from '@lit/react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoseTip } from 'common-web/dist';
import { generateMnemonic, englishWordList } from '@cfx-kit/wallet-core-methods/src';

export const BackupLoseTipBase = createComponent({
  react: React,
  tagName: 'backup-lose-tip',
  elementClass: LoseTip,
  events: {
    onClickNextButton: 'onClickNextButton',
  },
});

export const BackupLoseTip = () => {
  const navigate = useNavigate();
  const { vaultId } = useParams();

  return (
    <BackupLoseTipBase
      onClickNextButton={() => {
        if (vaultId) {
          navigate(`/backup/${vaultId}/show-mnemonic`);
        } else {
          navigate('/initialize/backup/show-mnemonic', { state: { value: generateMnemonic(englishWordList) } });
        }
      }}
    />
  );
};
