import crypto from 'crypto';

export class IncorrectPasswordError extends Error {
  message = 'Incorrect password';
  code = -2010287;
}

interface EncryptedData {
  cipher: string;
  iv: string;
  salt: string;
}

const SALT_BYTES_COUNT = 32;
const KEY_DERIVATION_ITERATIONS = 5000;
const AES_KEY_LENGTH = 256;

const isSupportWebCryptoAPI =
  typeof globalThis !== 'undefined' &&
  globalThis.crypto &&
  typeof globalThis.crypto.subtle === 'object' &&
  typeof globalThis.TextEncoder !== 'undefined' &&
  typeof globalThis.btoa === 'function' &&
  typeof globalThis.atob === 'function';

const base64ToArrayBuffer = (base64: string): ArrayBuffer => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buffer)));

type WebCryptoKey = CryptoKey;
type NodeCryptoKey = Buffer;
type CryptoKeyType = WebCryptoKey | NodeCryptoKey;

class Encryptor {
  private getPassword: (() => string) | (() => Promise<string>);

  constructor(getPassword: (() => string) | (() => Promise<string>)) {
    if (typeof getPassword === 'function') {
      this.getPassword = getPassword;
    } else {
      throw new Error('Password should be a function');
    }
  }

  protected generateSalt = (size: number = SALT_BYTES_COUNT): string => {
    const view = new Uint8Array(size);
    if (isSupportWebCryptoAPI) {
      globalThis.crypto.getRandomValues(view);
    } else {
      crypto.randomFillSync(view);
    }
    return arrayBufferToBase64(view.buffer);
  };

  protected generateKeyFromPassword = async (salt: string, password: string): Promise<CryptoKeyType> => {
    if (isSupportWebCryptoAPI) {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const saltBuffer = base64ToArrayBuffer(salt);

      const keyMaterial = await globalThis.crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']);

      return globalThis.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: KEY_DERIVATION_ITERATIONS,
          hash: 'SHA-512',
        },
        keyMaterial,
        { name: 'AES-CBC', length: AES_KEY_LENGTH },
        false,
        ['encrypt', 'decrypt'],
      ) as Promise<WebCryptoKey>;
    } else {
      return crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), KEY_DERIVATION_ITERATIONS, AES_KEY_LENGTH / 8, 'sha512');
    }
  };

  protected encryptWithKey = async (textToEncrypt: string, key: CryptoKeyType): Promise<Pick<EncryptedData, 'cipher' | 'iv'>> => {
    if (isSupportWebCryptoAPI) {
      const iv = globalThis.crypto.getRandomValues(new Uint8Array(16));
      const encrypted = await globalThis.crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key as WebCryptoKey, new TextEncoder().encode(textToEncrypt));

      return {
        iv: arrayBufferToBase64(iv),
        cipher: arrayBufferToBase64(encrypted),
      };
    } else {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key as NodeCryptoKey, iv);
      let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      return {
        iv: iv.toString('base64'),
        cipher: encrypted,
      };
    }
  };

  protected decryptWithKey = async (encryptedData: EncryptedData, key: CryptoKeyType): Promise<string> => {
    if (isSupportWebCryptoAPI) {
      const decrypted = await globalThis.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: base64ToArrayBuffer(encryptedData.iv) },
        key as WebCryptoKey,
        base64ToArrayBuffer(encryptedData.cipher),
      );

      return new TextDecoder().decode(decrypted);
    } else {
      const decipher = crypto.createDecipheriv('aes-256-cbc', key as NodeCryptoKey, Buffer.from(encryptedData.iv, 'base64'));
      let decrypted = decipher.update(encryptedData.cipher, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    }
  };

  public encrypt = async (object: any, _password?: string): Promise<string> => {
    const salt = this.generateSalt();
    const password = _password ?? (await this.getPassword());
    const key = await this.generateKeyFromPassword(salt, password);
    const result = await this.encryptWithKey(JSON.stringify(object), key);
    return JSON.stringify({ ...result, salt });
  };

  public decrypt = async <T = unknown>(encryptedDataString: string, _password?: string): Promise<T> => {
    try {
      const encryptedData = JSON.parse(encryptedDataString) as EncryptedData;
      const password = _password ?? (await this.getPassword());
      const key = await this.generateKeyFromPassword(encryptedData.salt, password);
      const data = await this.decryptWithKey(encryptedData, key);
      return JSON.parse(data);
    } catch (error) {
      throw new IncorrectPasswordError();
    }
  };
}

export default Encryptor;
