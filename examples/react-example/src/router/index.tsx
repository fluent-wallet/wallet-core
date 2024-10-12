import React from 'react';
import { Routes, Route, Outlet, Navigate, BrowserRouter } from 'react-router-dom';
import { useIsPasswordInitialized } from '@cfx-kit/wallet-core-react-inject/src';
import { InitializeCreateOrImport, InitializeBackupPrompt, BackupLoseTip, BackupShowMnemonic } from '../pages';

const AuthInitialize: React.FC<{ reverse?: boolean }> = ({ reverse }) => {
  const isPasswordInitialized = useIsPasswordInitialized();
  if (reverse) {
    if (isPasswordInitialized) {
      return <Navigate to="/wallet" replace />;
    }
  } else {
    if (!isPasswordInitialized) {
      return <Navigate to="/initialize" replace />;
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
            <Route path="/initialize/backup/" element={<Navigate to="/initialize/backup/lose-tip" replace />} />
            <Route path="/initialize/backup/*" element={<Navigate to="/initialize/backup/lose-tip" replace />} />
          </Route>
          {/* <Route path="password" element={<initialize-password />} /> */}
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
          <Route index element={<div>wallet</div>} />
        </Route>
        <Route path="backup/:vaultId" element={<Outlet />}>
          <Route path="lose-tip" element={<BackupLoseTip />} />
          <Route path="show-mnemonic" element={<BackupShowMnemonic />} />
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
