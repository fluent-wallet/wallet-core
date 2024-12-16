import * as R from 'ramda';
import { type RxPipeline } from 'rxdb/plugins/pipeline';
import { createDatabase, type Database, type State } from '@cfx-kit/wallet-core-database/src';
import { ChainMethods } from '@cfx-kit/wallet-core-chain/src';
import { protectAddChain } from './mechanism/protectAddChain';
import { pipelines } from '../../methods/src';
import { sendMessagInPopup, listenMessageInBackgroundCallback } from './mechanism/extensionEnhance';
export { default as InteractivePassword } from './mechanism/Encryptor/Password/InteractivePassword';
export { default as SecureMemoryPassword } from './mechanism/Encryptor/Password/MemoryPassword';
export { default as Encryptor, IncorrectPasswordError } from './mechanism/Encryptor/Encryptor';
export { PasswordRequestUserCancelError } from './mechanism/Encryptor/Password/InteractivePassword';
export * from '@cfx-kit/wallet-core-database/src';

type MethodWithDatabaseAndState<T> = ((dbAndState: { database: Database; state: State; }, ...args: any[]) => T) |
  ((dbAndState: { database: Database; }, ...args: any[]) => T) |
  ((dbAndState: { state: State; }, ...args: any[]) => T);

type MethodsMap = Record<string, MethodWithDatabaseAndState<any>>;
type MethodsWithDatabase<T extends MethodsMap> = {
  [K in keyof T]: MethodWithDatabaseAndState<any>;
};


export type RemoveFirstArg<T> = T extends (firstArg: infer F, ...args: infer P) => infer R
  ? F extends { database: Database } | { state: State } | { database: Database; state: State }
  ? (...args: P) => R
  : never
  : never;

export type ChainsMap = Record<string, ChainMethods>;

interface Data {
  database: Database;
  state: State;
}

export class PasswordNotInitializedError extends Error {
  message = 'Password not initialized';
  code = -2010286;
}

export class PasswordAlreadyInitializedError extends Error {
  message = 'Password already initialized';
  code = -2010285;
}

interface PasswordMethods {
  initPassword: (password: string) => Promise<void>;
  validatePassword: (password: string) => Promise<boolean>;
  isPasswordInitialized: () => Promise<boolean>;
  clearPassword: () => Promise<void>;
}


export type EXTENSION_TYPE = 'background' | 'popup' | 'content';


class WalletClass<T extends MethodsMap = any, J extends ChainsMap = any> {
  database: Database = null!;
  methods: { [K in keyof T]: RemoveFirstArg<T[K]> } & PasswordMethods = null!;
  chains: J = null!;
  pipelines: {
    [K in keyof typeof pipelines]: ReturnType<(typeof pipelines)[K]> extends Promise<RxPipeline<infer T>> ? RxPipeline<T> : never;
  } = null!;

  initPromise: Promise<Data> = null!;
  private resolve: (value: Data) => void = null!;
  private reject: (reason: any) => void = null!;
  private hasInit = false;
  extensionType: EXTENSION_TYPE | null = null;

  constructor({
    databaseOptions,
    methods,
    chains,
    injectDatabase,
    injectDatabasePromise,
    extensionType
  }: {
    databaseOptions: Parameters<typeof createDatabase>[0];
    methods?: MethodsWithDatabase<T>;
    chains?: J;
    injectDatabase?: Array<(data: Data) => any>;
    injectDatabasePromise?: Array<(dataPromise: Promise<Data>) => any>;
    /**
     * TODO:
     * extensionType为popup/content时，methods里的函数被替换为发送对应名字和参数的通讯方法;
     * extensionType为background时，methods里的函数被修改为接收popup/content发来的通讯，并执行对应方法。
     * */
    extensionType?: EXTENSION_TYPE;
  }) {
    this.extensionType = extensionType ?? null;

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
          this.methods = R.mapObjIndexed((fn) => R.partial(fn, [{ database, state }]), methods) as any;
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

          this.methods.clearPassword = async () => {
            await state.set('encryptorContent', () => null);
          };

          this.methods.initPassword = async (password) => {
            if (typeof password !== 'string' || !password) {
              throw new PasswordNotInitializedError('Password should be a string');
            }
            const encryptorContent = await state.get('encryptorContent');
            if (typeof encryptorContent === 'string') {
              console.warn('Password already initialized, will override it.');
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
          this.methods.clearPassword = () => Promise.resolve();
        }
        if (Array.isArray(injectDatabase)) {
          injectDatabase.forEach((fn) => fn?.({ database, state }));
        }
        const pipelinesArray = await Promise.all(Object.entries(pipelines).map(async ([name, pipeline]) => [name, await pipeline({ database }, this.chains)] as const))
        this.pipelines = Object.fromEntries(pipelinesArray) as any;

        if (this.extensionType === 'popup' || this.extensionType === 'content') {
          this.methods = sendMessagInPopup(this.methods, this.extensionType);
        } else if (this.extensionType === 'background') {
          listenMessageInBackgroundCallback(async (message: any) => {
            const { method, args } = message;
            if (typeof this.methods[method] === 'function') {
              return await this.methods[method](...args);
            }
          })
        }

        this.resolve({ database, state });
      })
      .catch((reason) => {
        this.reject(reason);
        console.error('Failed to initialize database: ', reason);
      });
  }
}

export default WalletClass;
