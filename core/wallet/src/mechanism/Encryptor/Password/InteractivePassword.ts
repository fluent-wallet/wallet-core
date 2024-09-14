import { BehaviorSubject, filter } from 'rxjs';

export interface PasswordRequest {
  resolve(value: string): void;
  reject(reason?: any): void;
}

class InteractivePassword {
  private passwordRequestSubject = new BehaviorSubject<PasswordRequest | null>(null);
  private pwdCache: string | null = null;
  private getPasswordPromise: Promise<string | null> | null = null;
  private pwdCacheTimer: NodeJS.Timeout | null = null;
  private cacheTime = 750; // ms

  public subPasswordRequest() {
    return this.passwordRequestSubject.pipe(filter((v) => v !== null));
  }

  public clearPasswordRequest() {
    this.passwordRequestSubject.next(null);
  }

  public getPassword = async () => {
    if (this.getPasswordPromise) return this.getPasswordPromise;
    this.getPasswordPromise = new Promise<string>((_resolve, _reject) => {
      if (!this.pwdCache) {
        if (this.pwdCacheTimer !== null) {
          clearTimeout(this.pwdCacheTimer);
          this.pwdCacheTimer = null;
        }

        this.passwordRequestSubject.next({
          resolve: (pwd: string) => {
            this.pwdCache = pwd;
            _resolve(pwd);
            this.pwdCacheTimer = setTimeout(() => {
              this.pwdCache = null;
              this.pwdCacheTimer = null;
            }, this.cacheTime);
          },
          reject: (err: any) => {
            this.pwdCache = null;
            _reject(err);
          },
        });
      } else {
        _resolve(this.pwdCache);
      }
    }).finally(() => {
      this.getPasswordPromise = null;
    });
    return this.getPasswordPromise;
  };
}

export default InteractivePassword;
