import { ReplaySubject, filter } from 'rxjs';

export class PasswordRequestTimeoutError extends Error {
  message = 'Password request timeout';
  code = -2010289;
}

export interface PasswordRequest {
  resolve(value: string): void;
  reject(reason?: any): void;
  timestamp: number;
}

export interface InteractivePasswordOptions {
  cacheTime?: number;
  timeout?: number;
}

class InteractivePassword {
  readonly #options: Required<InteractivePasswordOptions>;
  readonly #passwordRequestSubject = new ReplaySubject<PasswordRequest>(1);
  #pwdCache: string | null = null;
  #cacheExpiration: number = 0;
  #currentPasswordPromise: Promise<string> | null = null;

  constructor(options: InteractivePasswordOptions = {}) {
    this.#options = {
      cacheTime: options.cacheTime ?? 750,
      timeout: options.timeout ?? 5000,
    };
  }

  public get passwordRequest$() {
    return this.#passwordRequestSubject.asObservable().pipe(
      filter((request) => {
        const now = Date.now();
        return now - request.timestamp <= this.#options.cacheTime;
      }),
    );
  }

  public getPassword() {
    if (this.#isPasswordCached()) {
      return Promise.resolve(this.#pwdCache);
    }

    if (this.#currentPasswordPromise) {
      return this.#currentPasswordPromise;
    }

    this.#currentPasswordPromise = this.#requestNewPassword();
    this.#currentPasswordPromise
      .then((pwd) => {
        this.#cachePassword(pwd);
      })
      .catch(() => {})
      .finally(() => {
        this.#currentPasswordPromise = null;
      });
    return this.#currentPasswordPromise;
  }

  async #requestNewPassword() {
    return new Promise<string>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new PasswordRequestTimeoutError());
      }, this.#options.timeout);

      this.#passwordRequestSubject.next({
        resolve: (value: string) => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (reason?: any) => {
          clearTimeout(timeoutId);
          reject(reason);
        },
        timestamp: Date.now(),
      });
    });
  }

  #isPasswordCached() {
    return this.#pwdCache !== null && (Date.now() < this.#cacheExpiration);
  }

  #cachePassword(pwd: string) {
    this.#pwdCache = pwd;
    this.#cacheExpiration = Date.now() + this.#options.cacheTime;
  }

  public clearCache(): void {
    this.#pwdCache = null;
    this.#cacheExpiration = 0;
  }
}

export default InteractivePassword;
