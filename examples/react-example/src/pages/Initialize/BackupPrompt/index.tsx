import React from 'react';
import { createComponent } from '@lit/react';
import { useNavigate } from 'react-router-dom';
import { BackupPrompt } from 'common-web/dist';

export const InitializeBackupPromptBase = createComponent({
  react: React,
  tagName: 'initialize-backup-prompt',
  elementClass: BackupPrompt,
  events: {
    onClickBackButton: 'onClickBackButton',
    onClickRevealButton: 'onClickRevealButton',
  },
});

export const InitializeBackupPrompt = () => {
  const navigate = useNavigate();

  return <InitializeBackupPromptBase onClickBackButton={() => navigate(-1)} onClickRevealButton={() => navigate('/backup/lose-tip')} />;
};
