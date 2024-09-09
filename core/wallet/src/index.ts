import * as R from 'ramda';
import { createDatabase, type Database } from '@cfx-kit/wallet-core-database/src';

type MethodWithDatabase<T> = (db: Database, ...args: any[]) => T;
type MethodWithDBConstraint = MethodWithDatabase<any>;

type MethodsMap = Record<string, MethodWithDatabase<any>>;

type MethodsWithDatabase<T extends MethodsMap> = {
  [K in keyof T]: MethodWithDBConstraint;
};

type RemoveFirstArg<T> = T extends (db: Database, ...args: infer P) => infer R ? (...args: P) => R : never;

class WalletClass<T extends MethodsMap> {
  database: Awaited<ReturnType<typeof createDatabase>> = null!;
  methods: { [K in keyof T]: RemoveFirstArg<T[K]> } = null!;

  initPromise: ReturnType<typeof createDatabase> = null!;
  private resolve: (value: Awaited<ReturnType<typeof createDatabase>>) => void = null!;
  private reject: (reason: any) => void = null!;
  private hasInit = false;

  constructor() {
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
  }

  public init = async ({
    databaseOptions,
    methods,
    injectDatabase,
    injectDatabasePromise,
  }: {
    databaseOptions: Parameters<typeof createDatabase>[0];
    methods?: MethodsWithDatabase<T>;
    injectDatabase?: Array<(db: Database) => any>;
    injectDatabasePromise?: Array<(dbPromise: Promise<Database>) => any>;
  }) => {
    if (this.hasInit) {
      return this.initPromise;
    }
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
        if (Array.isArray(injectDatabase)) {
          injectDatabase.forEach((fn) => fn?.(db));
        }
      })
      .catch((reason) => {
        this.reject(reason);
        console.error('Failed to initialize database: ', reason);
      });
    return this.initPromise;
  };
}

export default WalletClass;
