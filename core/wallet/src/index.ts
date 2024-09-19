import * as R from 'ramda';
import { createDatabase, type Database } from '@cfx-kit/wallet-core-database/src';
import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { protectAddChain } from './mechanism/protectAddChain';
import pipelines from './mechanism/pipelines';
export { default as InteractivePassword } from './mechanism/Encryptor/Password/InteractivePassword';
export { default as SecureMemoryPassword } from './mechanism/Encryptor/Password/MemoryPassword';
export { IncorrectPassworError } from './mechanism/Encryptor/Encryptor';

type MethodWithDatabase<T> = (db: Database, ...args: any[]) => T;
type MethodWithDBConstraint = MethodWithDatabase<any>;

type MethodsMap = Record<string, MethodWithDatabase<any>>;

type MethodsWithDatabase<T extends MethodsMap> = {
  [K in keyof T]: MethodWithDBConstraint;
};

export type RemoveFirstArg<T> = T extends (db: Database, ...args: infer P) => infer R ? (...args: P) => R : never;

export type ChainsMap = Record<string, ChainMethods>;

export class PasswordNotInitializedError extends Error {
  message = 'Password not initialized';
  code = -2010286;
}

class WalletClass<T extends MethodsMap = any, J extends ChainsMap = any> {
  database: Database = null!;
  methods: { [K in keyof T]: RemoveFirstArg<T[K]> } & {
    validatePassword: (password: string | null | undefined) => Promise<boolean>;
    initPassword: (password: string) => Promise<void>;
  } = null!;
  chains: J = null!;

  initPromise: Promise<Database> = null!;
  private resolve: (value: Database) => void = null!;
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
  }) {
    this.initPromise = new Promise<Database>((resolve, reject) => {
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
      .then(async ({ database, state }) => {
        this.database = database;
        if (methods) {
          this.methods = R.mapObjIndexed((fn) => R.partial(fn, [database]), methods) as any;
        } else {
          this.methods = {} as any;
        }
        if (chains) {
          this.chains = chains;
          if (typeof this.methods.addChain === 'function') {
            (this.methods as any).addChain = protectAddChain({ chains: this.chains, addChain: this.methods.addChain });
          }
        }
        if (databaseOptions.encryptor && typeof databaseOptions.encryptor?.encrypt === 'function' && typeof databaseOptions.encryptor?.decrypt === 'function') {
          this.methods.initPassword = async (password) => {
            if (typeof password !== 'string' || !password) {
              throw new PasswordNotInitializedError('Password should be a string');
            }
            const encryptorContent = await state.get('encryptorContent');
            if (typeof encryptorContent === 'string') {
              return;
            }
            const encryptedContent = await databaseOptions.encryptor?.encrypt('encryptorContent', password);
            await state.set('encryptorContent', () => encryptedContent);
          };
          this.methods.validatePassword = async (password) => {
            if (!password) {
              return false;
            }
            const encryptorContent = await state.get('encryptorContent');
            if (typeof encryptorContent !== 'string') {
              throw new PasswordNotInitializedError();
            }
            try {
              await databaseOptions.encryptor?.decrypt(encryptorContent, password);
              return true;
            } catch {
              return false;
            }
          };
        } else {
          this.methods.initPassword = (password) => Promise.resolve();
          this.methods.validatePassword = (password) => Promise.resolve(true);
        }
        if (Array.isArray(injectDatabase)) {
          injectDatabase.forEach((fn) => fn?.(database));
        }
        pipelines.forEach((pipeline) => pipeline(database));
        this.resolve(database);
      })
      .catch((reason) => {
        this.reject(reason);
        console.error('Failed to initialize database: ', reason);
      });
  }
}

export default WalletClass;
