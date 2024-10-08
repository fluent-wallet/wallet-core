/// <reference types="vite/client" />

declare global {
  configReady: Promise<{
    passwordMethod: 'interactive' | 'persistence';
    storageMethod: 'IndexedDB' | 'Memory';
  }>;
}
