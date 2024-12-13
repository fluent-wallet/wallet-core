# 加密器 与 密码处理器

钱包的 助记词、私钥 等私密数据 (如 **Vault** 中的 `data` 字段 以及 **Address** 的 `privateKey` 字段)，当然不能明文存储在数据库中。所以我们需要提供一个 加解密器 - `Encryptor` 来处理这些私密数据。

[Wallet Class](../model-and-data/wallet-class.md) 中的 `databaseOptions` 参数能接收一个 `encryptor` 字段，WalletCore 在读写私密数据时会使用这个 `Encryptor`加密器 来处理私密数据。


encryptor 需要实现两个 public 方法：用来加密的 `encrypt` 方法，和用来解密的 `decrypt` 方法。

```typescript
class Encryptor {
  public encrypt: (data: any, password: string) => Promise<string>
  public decrypt: <T>(encryptedDataString: string, password: string) => Promise<T>
}
```

很显然，单单有 `Encryptor` 是不够的，我们还需要一个 密码处理器 - `Password Handler` 获取用户输入的密码，将密码传递给 `encryptor` 进行加解密操作。

WalletCore 提供了一种 `Encryptor`、两种 `PasswordHandler` 的实现，当然如果你对我们提供的方案不满意，你可以选择自己去实现。


## Encryptor

官方的 `Encryptor` 实现中，构造函数接收一个 getPassword 方法作为参数，执行 `encrypt` 和 `decrypt` 方法时，会调用这个 getPassword 方法获取密码。

```typescript
type GetPassword = (() => string) | (() => Promise<string>);

class Encryptor {
  private getPassword: GetPassword;
  constructor(getPassword: GetPassword);

  public encrypt: (data: any, password: string = this.getPassword()) => Promise<string>
  public decrypt: <T>(encryptedDataString: string, password: string = this.getPassword()) => Promise<T>
}
```

## MemoryPassword

MemoryPassword 其中一种 `PasswordHandler` 实现。插件钱包 多采用这种方式的密码处理器，在首次打开钱包 lock 时输入一次密码，然后将密码存储在内存中。只要不关闭钱包，后续钱包使用时，就不需要再次输入密码。

MemoryPassword 提供了 `getPassword` 方法。

```typescript
class MemoryPassword {
  public getPassword: () => Promise<string>;
}
```



## InteractivePassword

InteractivePassword 是另一种 `PasswordHandler` 实现。移动端钱包 多采用这种方式的密码处理器，打开钱包时候不需要输入密码，只有在需要 读取 助记词/私钥 时，才会弹出密码输入框让用户输入。

InteractivePassword 提供了 `getPassword` 方法 和 `passwordRequest$` 的 **Observable对象** 来响应 助记词/私钥 的读取请求。

```typescript
class InteractivePassword {
  public getPassword: () => Promise<string>;
  public passwordRequest$: Observable<PasswordRequest>;
}
```


## 使用示例

::: tabs
== ./memoryPassword.ts
```typescript
import { useState } from 'react';
import { Observable } from 'rxjs';
import MemoryPassword from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor/Password/MemoryPassword';

export const memoryPassword = new MemoryPassword();

function useObservableState<T>(observable: Observable<T>, initialState: T): T {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const subscription = observable.subscribe(value => {
      setState(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable]);

  return state;
}

export const useIsPersistencePasswordSetted = () => useObservableState(memoryPassword.isPasswordSetted$, false);
```
==

== ./interactivePassword.ts
```typescript
import { useEffect } from 'react';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor/Password/InteractivePassword';
import { IncorrectPasswordError, PasswordRequestUserCancelError } from '@cfx-kit/wallet-core-wallet/src';

export const interactivePassword = new InteractivePassword();

/** Pass wallet through props to prevent circular dependency */
export const RespondInteractivePassword: React.FC<{ wallet: WalletClass }> = ({ wallet }) => {
  useEffect(() => {
    if (walletConfig.passwordMethod !== 'interactive') return;

    const subscription = interactivePassword.passwordRequest$.subscribe(async (request) => {
      const password = prompt('Please input password', '12345678');
      if (password) {
        if (await wallet.methods.validatePassword(password)) {
          request.resolve(password);
        } else {
          request.reject(new IncorrectPasswordError());
        }
      } else {
        request.reject(new PasswordRequestUserCancelError());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
};

```
==

== ./wallet.ts (Encryptor)
```typescript
import Encryptor from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor';
import { interactivePassword } from './interactivePassword';
import { memoryPassword } from './memoryPassword';


// 使用 memoryPassword 作为 PasswordHandler
const wallet = new WalletClass({
  databaseOptions: {
    encryptor:
      new Encryptor(memoryPassword.getPassword.bind(memoryPassword)) 
  }
});

// 使用 interactivePassword 作为 PasswordHandler
const wallet = new WalletClass({
  databaseOptions: {
    encryptor:
      new Encryptor(interactivePassword.getPassword.bind(interactivePassword)) 
  }
});

```
==
::: 