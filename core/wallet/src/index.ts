import * as R from 'ramda';
import { type RxPipeline } from 'rxdb/plugins/pipeline';
import { createDatabase, type Database, type State } from '@cfx-kit/wallet-core-database/src';
import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { protectAddChain } from './mechanism/protectAddChain';
import { pipelines } from '../../methods/src';
export { default as InteractivePassword } from './mechanism/Encryptor/Password/InteractivePassword';
export { default as SecureMemoryPassword } from './mechanism/Encryptor/Password/MemoryPassword';
export { IncorrectPasswordError } from './mechanism/Encryptor/Encryptor';

type MethodWithDatabase<T> = (db: Database, ...args: any[]) => T;
type MethodWithDBConstraint = MethodWithDatabase<any>;

type MethodsMap = Record<string, MethodWithDatabase<any>>;

type MethodsWithDatabase<T extends MethodsMap> = {
  [K in keyof T]: MethodWithDBConstraint;
};

export type RemoveFirstArg<T> = T extends (db: Database, ...args: infer P) => infer R ? (...args: P) => R : never;

export type ChainsMap = Record<string, ChainMethods>;

interface Data {
  database: Database;
  state: State;
}

export class PasswordNotInitializedError extends Error {
  message = 'Password not initialized';
  code = -2010286;
}

class WalletClass<T extends MethodsMap = any, J extends ChainsMap = any> {
  database: Database = null!;
  methods: { [K in keyof T]: RemoveFirstArg<T[K]> } & {
    validatePassword: (password: string | null | undefined) => Promise<boolean>;
    initPassword: (password: string) => Promise<void>;
    isPasswordInitialized: () => Promise<boolean>;
    resetPassword: () => Promise<void>;
  } = null!;
  chains: J = null!;
  pipelines: {
    [K in keyof typeof pipelines]: ReturnType<(typeof pipelines)[K]> extends Promise<RxPipeline<infer T>> ? RxPipeline<T> : never;
  } = null!;

  initPromise: Promise<Data> = null!;
  private resolve: (value: Data) => void = null!;
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
    injectDatabase?: Array<(data: Data) => any>;
    injectDatabasePromise?: Array<(dataPromise: Promise<Data>) => any>;
  }) {
    this.initPromise = new Promise<Data>((resolve, reject) => {
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
          this.methods.isPasswordInitialized = async () => {
            const encryptorContent = await state.get('encryptorContent');
            return typeof encryptorContent === 'string' && !!encryptorContent;
          };

          this.methods.resetPassword = async () => {
            await state.set('encryptorContent', () => null);
          };

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
            const encryptorContent: string = await state.get('encryptorContent');
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
          this.methods.isPasswordInitialized = () => Promise.resolve(true);
          this.methods.resetPassword = () => Promise.resolve();
        }
        if (Array.isArray(injectDatabase)) {
          injectDatabase.forEach((fn) => fn?.({ database, state }));
        }
        const pipelinesArray = await Promise.all(Object.entries(pipelines).map(async ([name, pipeline]) => [name, await pipeline(database, this.chains)] as const))
        this.pipelines = Object.fromEntries(pipelinesArray) as any;
        this.resolve({ database, state });
      })
      .catch((reason) => {
        this.reject(reason);
        console.error('Failed to initialize database: ', reason);
      });
  }
}

export default WalletClass;
