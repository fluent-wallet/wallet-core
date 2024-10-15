import React from 'react';
import { Routes, Route, Outlet, Navigate, BrowserRouter } from 'react-router-dom';
import { useIsPasswordInitialized, useVaultsCount } from '@cfx-kit/wallet-core-react-inject/src';
import { InitializeCreateOrImport, InitializeBackupPrompt, InitializePassword, BackupLoseTip, BackupShowMnemonic, BackupVerifyMnemonic, WalletUnlock, WalletHome, } from '@pages/index';
import wallet, { walletConfig, useIsPersistencePasswordSetted, RespondInteractivePassword } from '@wallet/index';

const AuthInitialize: React.FC<{ reverse?: boolean }> = ({ reverse }) => {
  const isPasswordInitialized = useIsPasswordInitialized();
  const vaultsCount = useVaultsCount();
  const isWalletInitialized = isPasswordInitialized && vaultsCount > 0;

  /** use only when passwordMethod is persistence */
  const isPersistencePasswordSetted = useIsPersistencePasswordSetted();

  if (reverse) {
    if (isWalletInitialized) {
      return <Navigate to="/wallet" replace />;
    }
  } else {
    if (!isWalletInitialized) {
      return <Navigate to="/initialize" replace />;
    } else {
      /** use only when passwordMethod is persistence */
      if (walletConfig.passwordMethod === 'persistence' && !isPersistencePasswordSetted) {
        return <Navigate to="/wallet/unlock" replace />;
      }
    }
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route
          path="initialize"
          element={
            <>
              <Outlet />
              <AuthInitialize reverse />
            </>
          }
        >
          <Route path="create-or-import" element={<InitializeCreateOrImport />} />
          <Route path="backup-prompt" element={<InitializeBackupPrompt />} />
          <Route path="backup" element={<Outlet />}>
            <Route path="lose-tip" element={<BackupLoseTip />} />
            <Route path="show-mnemonic" element={<BackupShowMnemonic />} />
            <Route path="verify-mnemonic" element={<BackupVerifyMnemonic />} />
            <Route path="/initialize/backup/" element={<Navigate to="/initialize/backup/lose-tip" replace />} />
            <Route path="/initialize/backup/*" element={<Navigate to="/initialize/backup/lose-tip" replace />} />
          </Route>
          <Route path="set-password" element={<InitializePassword />} />
          <Route path="/initialize/" element={<Navigate to="/initialize/create-or-import" replace />} />
          <Route path="/initialize/*" element={<Navigate to="/initialize/create-or-import" replace />} />
        </Route>
        <Route
          path="wallet"
          element={
            <>
              <Outlet />
              <AuthInitialize />
            </>
          }
        >
          <Route index element={<WalletHome />} />
          {walletConfig.passwordMethod === 'persistence' && <Route path="unlock" element={<WalletUnlock />} />}
          <Route path="/wallet/" element={<Navigate to="/wallet" replace />} />
          <Route path="/wallet/*" element={<Navigate to="/wallet" replace />} />
        </Route>
        <Route path="backup/:vaultId" element={<Outlet />}>
          <Route path="lose-tip" element={<BackupLoseTip />} />
          <Route path="show-mnemonic" element={<BackupShowMnemonic />} />
          <Route path="verify-mnemonic" element={<BackupVerifyMnemonic />} />
          <Route path="/backup/:vaultId/" element={<Navigate to="/backup/:vaultId/lose-tip" replace />} />
          <Route path="/backup/:vaultId/*" element={<Navigate to="/backup/:vaultId/lose-tip" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/initialize" replace />} />
        <Route path="*" element={<Navigate to="/initialize" replace />} />
      </Route>
    </Routes>
  );
};

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default RouterComponent;
