import * as R from 'ramda';
import { createDatabase, type Database } from '@cfx-kit/wallet-core-database/src';
import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { protectAddChain } from './mechanism/protectAddChain';
import Encryptor from './mechanism/VaultEncryptor/Encryptor';
import type InteractivePassword from './mechanism/VaultEncryptor/Password/InteractivePassword';
import type SecureMemoryPassword from './mechanism/VaultEncryptor/Password/SecureMemoryPassword';
export { default as InteractivePassword } from './mechanism/VaultEncryptor/Password/InteractivePassword';
export { default as SecureMemoryPassword } from './mechanism/VaultEncryptor/Password/SecureMemoryPassword';

type MethodWithDatabase<T> = (db: Database, ...args: any[]) => T;
type MethodWithDBConstraint = MethodWithDatabase<any>;

type MethodsMap = Record<string, MethodWithDatabase<any>>;

type MethodsWithDatabase<T extends MethodsMap> = {
  [K in keyof T]: MethodWithDBConstraint;
};

export type RemoveFirstArg<T> = T extends (db: Database, ...args: infer P) => infer R ? (...args: P) => R : never;

export type ChainsMap = Record<string, ChainMethods>;

class WalletClass<T extends MethodsMap = any, J extends ChainsMap = any> {
  database: Awaited<ReturnType<typeof createDatabase>> = null!;
  methods: { [K in keyof T]: RemoveFirstArg<T[K]> } = null!;
  chains: J = null!;

  initPromise: ReturnType<typeof createDatabase> = null!;
  private resolve: (value: Awaited<ReturnType<typeof createDatabase>>) => void = null!;
  private reject: (reason: any) => void = null!;
  private hasInit = false;

  constructor({
    databaseOptions,
    methods,
    chains,
    injectDatabase,
    injectDatabasePromise,
  }: {
    databaseOptions: Parameters<typeof createDatabase>[0];
    methods?: MethodsWithDatabase<T>;
    chains?: J;
    injectDatabase?: Array<(db: Database) => any>;
    injectDatabasePromise?: Array<(dbPromise: Promise<Database>) => any>;
    Password: InteractivePassword | SecureMemoryPassword;
  }) {
    this.initPromise = new Promise<Awaited<ReturnType<typeof createDatabase>>>((resolve, reject) => {
      this.resolve = R.pipe(
        R.tap(() => (this.hasInit = true)),
        resolve,
      );
      this.reject = R.pipe(
        R.tap(() => (this.hasInit = false)),
        reject,
      );
    });

    if (Array.isArray(injectDatabasePromise)) {
      injectDatabasePromise.forEach((fn) => fn?.(this.initPromise));
    }
    createDatabase(databaseOptions)
      .then((db) => {
        this.database = db;
        this.resolve(db);
        if (methods) {
          this.methods = R.mapObjIndexed((fn) => R.partial(fn, [db]), methods) as any;
        }
        if (chains) {
          this.chains = chains;
          if (typeof this.methods.addChain === 'function') {
            (this.methods as any).addChain = protectAddChain({ chains: this.chains, addChain: this.methods.addChain });
          }
          if (typeof this.methods.getPrivateKeyOfAccount) {
          }
        }
        if (Array.isArray(injectDatabase)) {
          injectDatabase.forEach((fn) => fn?.(db));
        }
      })
      .catch((reason) => {
        this.reject(reason);
        console.error('Failed to initialize database: ', reason);
      });
  }
}

export default WalletClass;
