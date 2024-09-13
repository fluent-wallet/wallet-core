import crypto from 'crypto';

interface EncryptedData {
  cipher: string;
  iv: string;
  salt: string;
}

const SALT_BYTES_COUNT = 32;
const SHA256_DIGEST_LENGTH = 256;
const KEY_DERIVATION_ITERATIONS = 5000;

const isSupportWebCryptoAPI = typeof global !== 'undefined' && global.crypto && typeof global.crypto.subtle === 'object';

const base64ToArrayBuffer = (base64: string): ArrayBuffer => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buffer)));

class Encryptor {
  private getPassword: (() => string) | (() => Promise<string>);
  constructor(getPassword: (() => string) | (() => Promise<string>) | string) {
    if (typeof getPassword === 'function') {
      this.getPassword = getPassword;
    } else {
      throw new Error('Password should be a r a function');
    }
  }

  protected generateSalt = (size: number = SALT_BYTES_COUNT) => {
    const view = new Uint8Array(size);
    if (isSupportWebCryptoAPI) {
      global.crypto.getRandomValues(view);
    } else {
      crypto.getRandomValues(view);
    }
    return btoa(String.fromCharCode.apply(null, view as unknown as Array<number>));
  };

  protected generateKeyFromPassword = async (salt: string, password: string) => {
    if (isSupportWebCryptoAPI) {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const saltBuffer = encoder.encode(salt);

      const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveKey', 'deriveBits']);

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: KEY_DERIVATION_ITERATIONS,
          hash: 'SHA-512',
        },
        keyMaterial,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        true,
        ['sign', 'verify'],
      );

      const rawKey = await crypto.subtle.exportKey('raw', derivedKey);

      return btoa(String.fromCharCode(...new Uint8Array(rawKey)));
    } else {
      const result = crypto.pbkdf2Sync(password, salt, KEY_DERIVATION_ITERATIONS, SHA256_DIGEST_LENGTH / 8, 'sha512');
      return result.toString('base64');
    }
  };

  protected encryptWithKey = async (text: string, keyBase64: string): Promise<Pick<EncryptedData, 'cipher' | 'iv'>> => {
    if (isSupportWebCryptoAPI) {
      const iv = global.crypto.getRandomValues(new Uint8Array(16));
      const key = await crypto.subtle.importKey('raw', base64ToArrayBuffer(keyBase64), 'AES-CBC', false, ['encrypt']);

      const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, new TextEncoder().encode(text));

      return {
        iv: arrayBufferToBase64(iv),
        cipher: arrayBufferToBase64(encrypted),
      };
    } else {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(keyBase64, 'base64'), iv);
      let encrypted = cipher.update(text, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      return {
        iv: iv.toString('base64'),
        cipher: encrypted,
      };
    }
  };

  protected decryptWithKey = async (encryptedData: EncryptedData, keyBase64: string) => {
    if (isSupportWebCryptoAPI) {
      const key = await crypto.subtle.importKey('raw', base64ToArrayBuffer(keyBase64), 'AES-CBC', false, ['decrypt']);

      const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: base64ToArrayBuffer(encryptedData.iv) }, key, base64ToArrayBuffer(encryptedData.cipher));

      return new TextDecoder().decode(decrypted);
    } else {
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(keyBase64, 'base64'), Buffer.from(encryptedData.iv, 'base64'));
      let decrypted = decipher.update(encryptedData.cipher, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    }
  };

  /**
   * Encrypts a JS data using a password (and AES encryption with native libraries)
   * @param {object} object - Data object to encrypt
   * @returns - Promise resolving to stringified data
   */
  public encrypt = async (object: unknown) => {
    const salt = this.generateSalt();
    const password = await this.getPassword();
    const key = await this.generateKeyFromPassword(salt, password);
    const result = (await this.encryptWithKey(JSON.stringify(object), key)) as EncryptedData;
    result.salt = salt;
    return JSON.stringify(result);
  };

  /**
   * Decrypts an encrypted string (encryptedString)
   * @param {string} encryptedString - String to decrypt
   * @returns - Promise resolving to decrypted data object
   */
  public decrypt = async <T = unknown>(encryptedDataString: string): Promise<T> => {
    const encryptedData = JSON.parse(encryptedDataString) as EncryptedData;
    const password = await this.getPassword();
    const key = await this.generateKeyFromPassword(encryptedData.salt, password);
    const data = await this.decryptWithKey(encryptedData, key);
    return JSON.parse(data);
  };
}

export default Encryptor;
