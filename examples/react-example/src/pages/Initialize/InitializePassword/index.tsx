import React from 'react';
import { createComponent } from '@lit/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateMnemonic, englishWordList } from '@cfx-kit/wallet-core-methods/src';
import { InitializePassword as InitializePasswordWC } from 'common-web/dist';
import wallet, { walletConfig, memoryPassword, interactivePassword } from '@wallet/index';

export const InitializePasswordBase = createComponent({
  react: React,
  tagName: 'initialize-password',
  elementClass: InitializePasswordWC,
  events: {
    onClickBackButton: 'onClickBackButton',
    onClickSetButton: 'onClickSetButton',
  },
});

export const InitializePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mnemonic, isBackup } = location.state ?? {};

  return (
    <InitializePasswordBase
      onClickBackButton={() => navigate('/initialize')}
      onClickSetButton={async (evt) => {
        const target = evt.target as InitializePasswordWC;
        const password = target.password;
        if (!password) {
          return;
        }
        try {
          await wallet.methods.initPassword(password);
          if (walletConfig.passwordMethod === 'persistence') {
            memoryPassword.setPassword(password);
          } else {
            interactivePassword.cachePassword(password);
          }
          await wallet.methods.addMnemonicVault({ mnemonic: mnemonic ?? generateMnemonic(englishWordList), isBackup });
          navigate('/wallet');
        } catch (error) {
          console.error('设置密码失败:', error);
        }
      }}
    />
  );
};
