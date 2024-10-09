import { Routes, HashRouter, Route, Outlet, Link } from 'react-router-dom';
import { useIsPasswordInitialized } from '@cfx-kit/wallet-core-react-inject/src';

const AppRoutes = () => {
  const isPasswordInitialized = useIsPasswordInitialized();
  console.log('isPasswordInitialized', isPasswordInitialized);

  return (
    <div>
      <h1>Basic Example</h1>

      <p>
        This example demonstrates some of the core features of React Router including nested <code>&lt;Route&gt;</code>s, <code>&lt;Outlet&gt;</code>s, <code>&lt;Link&gt;</code>s,
        and using a "*" route (aka "splat route") to render a "not found" page when someone visits an unrecognized URL.
      </p>
    </div>
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
