import React from 'react';
import { createComponent } from '@lit/react';
import { useNavigate } from 'react-router-dom';
import { WalletUnlock as WalletUnlockWC } from 'common-web/dist';
import wallet, { walletConfig, memoryPassword } from '@wallet/index';

export const WalletUnlockBase = createComponent({
  react: React,
  tagName: 'wallet-unlock',
  elementClass: WalletUnlockWC,
  events: {
    onClickUnlockButton: 'onClickUnlockButton',
  },
});

export const WalletUnlock = () => {
  const navigate = useNavigate();

  return (
    <WalletUnlockBase
      onClickUnlockButton={async (evt) => {
        const target = evt.target as WalletUnlockWC;
        const password = target.password;
        if (await wallet.methods.validatePassword(password)) {
          memoryPassword.setPassword(password);
          navigate('/wallet');
        } else {
          alert(walletConfig.language === 'en' ? 'Password is incorrect' : '密码错误');
        }
      }}
    />
  );
};
