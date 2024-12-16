# 加密器 与 密码处理器

钱包的 助记词、私钥 等私密数据 (如 **Vault** 中的 `data` 字段 以及 **Address** 的 `privateKey` 字段)，当然不能明文存储在数据库中。所以我们需要提供一个 加解密器 - `Encryptor` 来处理这些私密数据。

[Wallet Class](../model-and-data/wallet-class.md) 中的 `databaseOptions` 参数能接收一个 `encryptor` 字段，WalletCore 在读写私密数据时会使用这个 `Encryptor`加密器 来处理私密数据。


encryptor 需要实现两个 public 方法：用来加密的 **encrypt** 方法，和用来解密的 **decrypt** 方法。

```typescript
class Encryptor {
  public encrypt: (data: any, password: string) => Promise<string>
  public decrypt: <T>(encryptedDataString: string, password: string) => Promise<T>
}
```

**encrypt** 和 **decrypt** 方法各自需要一个 `password` 参数。所以，仅仅有 `Encryptor` 是不够的，我们还需要一个 密码处理器 - `Password Handler` 来获取用户输入的密码，并将密码传递给 `encryptor` 进行解密操作。

此外，还需要注意本篇中的[初始化密码](./encryptor-and-password.md#初始化密码)，来处理 `Password Handler` 对用户输入密码的校验。

WalletCore 提供了一种 `Encryptor`、两种 `PasswordHandler` 的实现，当然如果你对我们提供的方案不满意，你可以自己去实现。


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

## 初始化密码

如果使用 `Encryptor`，**WalletClass instance** 的 `methods` 对象中会多出四种方法：[initPassword](../model-and-data/methods-api.md#initpassword)、[validatePassword](../model-and-data/methods-api.md#validatepassword)、[isPasswordInitialized](../model-and-data/methods-api.md#ispasswordinitialized)、[clearPassword](../model-and-data/methods-api.md#clearpassword)。

```typescript
interface PasswordMethods {
  initPassword: (password: string) => Promise<void>;
  validatePassword: (password: string) => Promise<boolean>;
  isPasswordInitialized: () => Promise<boolean>;
  clearPassword: () => Promise<void>;
}
```

你需要在用户首次使用钱包的初始化流程中，完成 **initPassword** 方法的调用，**initPassword** 方法会使用参数中的密码调用 `Encryptor` 的 **encrypt** 方法，将一个随机字符串写入数据库 `State` 中的内部字段里。后续调用 **validatePassword** 方法时，会使用参数密码尝试去解密这个字符串，如果解密成功，则表示密码正确。

当使用下述 **MemoryPassword** 这种暂存式的密码处理器时，你应该先调用 **validatePassword** 方法，在验证密码正确性后再调用 密码处理器的暂存方法(如 `memoryPassword.setPassword` 方法)将密码暂存起来使用。

当使用下述 **InteractivePassword** 这种交互式的密码处理器时，每次触发 密码调用请求(不管是 **encrypt** 还是 **decrypt**)，你都得先调用 **validatePassword** 方法，验证密码正确性后再 resolve 密码调用请求。

::: tip 警告
**请严格遵循这套流程，以确保所有的私密数据的加解密操作都使用同样的密码**
:::

## MemoryPassword

MemoryPassword 其中一种 `PasswordHandler` 实现。插件钱包 多采用这种方式的密码处理器，在首次打开钱包 lock 时输入一次密码，然后将密码存储在内存中。只要不关闭钱包，后续钱包使用时，就不需要再次输入密码。

MemoryPassword 暴露了以下三种方法:

```typescript
class MemoryPassword {
  /** 暂存密码 */
  public setPassword: (password: string) => void;
  /** 获取被暂存的密码 */
  public getPassword: () => Promise<string>;
  /** 清除暂存的密码 */
  public clearPassword: () => void;
}
```

下面是 MemoryPassword 的使用示例：

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

export const useIsMemoryPasswordSetted = () => useObservableState(memoryPassword.isPasswordSetted$, false);
```
==

== ./wallet.ts (Encryptor)
```typescript
import Encryptor from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor';
import { memoryPassword } from './memoryPassword';
export { memoryPassword } from './memoryPassword';

const wallet = new WalletClass({
  databaseOptions: {
    encryptor:
      new Encryptor(memoryPassword.getPassword.bind(memoryPassword)) 
  }
});

```
==

== Unlock Page
```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { wallet, memoryPassword } from '@wallet/index';

const WalletUnlock: React.FC = () => {
  const navigate = useNavigate();

  return (
    <WalletUnlockBase
      onClickUnlockButton={async (evt) => {
        const userInputPassword = evt.target.password;
        if (await wallet.methods.validatePassword(userInputPassword)) {
          memoryPassword.setPassword(userInputPassword);
          navigate('/wallet/home');
        } else {
          alert('Password is incorrect');
        }
      }}
    />
  );
};
```
==
::: 


## InteractivePassword

InteractivePassword 是另一种 `PasswordHandler` 实现。移动端钱包 多采用这种方式的密码处理器，打开钱包时候不需要输入密码，只有在需要 读取 助记词/私钥(加解密数据) 时，才会弹出密码输入框让用户输入。

InteractivePassword 提供 `passwordRequest$` 的 **Observable对象** 来响应 助记词/私钥 的读取请求。
使用时需要订阅这个 Observable 对象，当有请求时需要在UI上弹出密码输入框，让用户输入密码。

passwordRequest 对象中包含 **resolve** 和 **reject** 方法，当用户输入密码校验通过时，
调用 **resolve** 方法 就能让正在 await 中的 `Encryptor` 的 **encrypt / decrypt** 方法继续执行。反之则需要调用 **reject**。


```typescript
interface PasswordRequest {
  resolve(value: string): void;
  reject(reason?: any): void;
}

class InteractivePassword {
  public getPassword: () => Promise<string>;
  public passwordRequest$: Observable<PasswordRequest>;
}
```

下面是 InteractivePassword 的使用示例：

::: tabs
== ./interactivePassword.ts
```typescript
import { useEffect } from 'react';
import InteractivePassword from '@cfx-kit/wallet-core-wallet/mechanism/Encryptor/Password/InteractivePassword';
import { IncorrectPasswordError, PasswordRequestUserCancelError } from '@cfx-kit/wallet-core-wallet/src';

export const interactivePassword = new InteractivePassword();

/** 处理 passwordRequest$ 的请求，弹框让用户输入密码 */
export const RespondInteractivePassword: React.FC<{ wallet: WalletClass }> = ({ wallet }) => {
  useEffect(() => {
    const subscription = interactivePassword.passwordRequest$.subscribe(async (request) => {
      const userInputPassword = prompt('Please input password', '12345678');
      if (userInputPassword) {
        if (await wallet.methods.validatePassword(userInputPassword)) {
          request.resolve(userInputPassword);
        } else {
          // 或者你自己定义的错误
          request.reject(new IncorrectPasswordError());
        }
      } else {
        // 或者你自己定义的错误
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
export { interactivePassword } from './interactivePassword';


export const wallet = new WalletClass({
  databaseOptions: {
    encryptor:
      new Encryptor(interactivePassword.getPassword.bind(interactivePassword)) 
  }
});
```

== Respond 组件(以 main.tsx 为例)
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { wallet } from '@wallet/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <RespondInteractivePassword wallet={wallet} />
  </StrictMode>,
);
```
==
::: 