import { ReplaySubject, filter } from 'rxjs';

export class PasswordRequestTimeoutError extends Error {
  message = 'Password request timeout';
  code = -2010289;
}

export class PasswordRequestUserCancelError extends Error {
  message = 'User canceled password request';
  code = -2010288;
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
      cacheTime: options.cacheTime ?? 400,
      timeout: options.timeout ?? 0,
    };
  }

  public get passwordRequest$() {
    return this.#passwordRequestSubject.asObservable().pipe(
      filter((request) => {
        const now = Date.now();
        return this.#options.timeout === 0 || now - request.timestamp <= this.#options.timeout;
      }),
    );
  }

  public getPassword() {
    if (this.#isPasswordCached()) {
      return Promise.resolve(this.#pwdCache!);
    }

    if (this.#currentPasswordPromise) {
      return this.#currentPasswordPromise;
    }

    this.#currentPasswordPromise = this.#requestNewPassword();
    this.#currentPasswordPromise
      .then((pwd) => {
        this.cachePassword(pwd);
      })
      .catch(() => { })
      .finally(() => {
        this.#currentPasswordPromise = null;
      });
    return this.#currentPasswordPromise;
  }

  async #requestNewPassword() {
    return new Promise<string>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | null = null;
      
      if (this.#options.timeout > 0) {
        timeoutId = setTimeout(() => {
          reject(new PasswordRequestTimeoutError());
        }, this.#options.timeout);
      }

      this.#passwordRequestSubject.next({
        resolve: (value: string) => {
          if (timeoutId) clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (reason?: any) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(reason);
        },
        timestamp: Date.now(),
      });
    });
  }

  #isPasswordCached() {
    return this.#pwdCache !== null && (Date.now() < this.#cacheExpiration);
  }

  public cachePassword(pwd: string) {
    this.#pwdCache = pwd;
    this.#cacheExpiration = Date.now() + this.#options.cacheTime;
  }

  public clearCache(): void {
    this.#pwdCache = null;
    this.#cacheExpiration = 0;
  }
}

export default InteractivePassword;
