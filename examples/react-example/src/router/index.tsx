import { Routes, HashRouter, Route, Outlet, Navigate } from 'react-router-dom';
import { useIsPasswordInitialized } from '@cfx-kit/wallet-core-react-inject/src';

const AuthInitialize: React.FC<{ reverse?: boolean }> = ({ reverse }) => {
  const isPasswordInitialized = useIsPasswordInitialized();

  if (reverse) {
    if (isPasswordInitialized) {
      return <Navigate to="/wallet" />;
    }
  } else {
    if (!isPasswordInitialized) {
      return <Navigate to="/initialize" />;
    }
  }
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="initialize" element={<Outlet />}>
            <Route index element={<Navigate to="create-or-import" />} />
            <Route path="create-or-import" element={<initialize-create-or-import />} />
            <Route path="vault" element={<div>vault</div>} />
          </Route>
          <Route path="wallet" element={<Outlet />}>
            <Route index element={<div>wallet</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/initialize" />} />
        </Route>
      </Routes>
      <AuthInitialize />
    </>
  );
};

const Router = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default Router;
