const walletConfig = (globalThis as any).walletConfig as {
  passwordMethod: 'interactive' | 'persistence';
  storageMethod: 'IndexedDB' | 'Memory';
  language: 'en' | 'zh';
};

export default walletConfig;