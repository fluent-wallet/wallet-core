import { Mutex } from 'async-mutex';
import crypto from 'crypto';
const getRandomValues =
  typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function'
    ? (globalThis.crypto.getRandomValues as typeof crypto.getRandomValues)
    : crypto.getRandomValues;

/**
 * Passwords in memory should not exist in plain text. Therefore, here we add a salt and then use XOR for simple obfuscation.
 * Each time it is used, check the last update time.
 * If it exceeds the time specified by updateInterval (default 5 minutes), update the salt and re-encrypt it.
 */
class SecureMemoryPassword {
  private data: Uint8Array;
  private salt: Uint8Array;
  private lastUpdate: number;
  private readonly updateInterval: number;
  private mutex: Mutex;

  private constructor(password: string, updateIntervalMs: number = 60000 * 5) {
    this.salt = getRandomValues(new Uint8Array(32));
    this.data = this.encode(password);
    this.lastUpdate = Date.now();
    this.updateInterval = updateIntervalMs;
    this.mutex = new Mutex();
  }

  public static create(password: string, updateIntervalMs?: number): SecureMemoryPassword {
    return new SecureMemoryPassword(password, updateIntervalMs);
  }

  private encode(password: string): Uint8Array {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    return this.xorEncrypt(passwordData, this.salt);
  }

  private decode(): string {
    const decrypted = this.xorEncrypt(this.data, this.salt);
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  private xorEncrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
    const extendedKey = new Uint8Array(Math.max(data.length, key.length));
    for (let i = 0; i < extendedKey.length; i++) {
      extendedKey[i] = key[i % key.length]!;
    }

    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i]! ^ extendedKey[i]!;
    }

    return result;
  }

  private async updateEncoding(): Promise<void> {
    await this.mutex.runExclusive(() => {
      const currentTime = Date.now();
      if (currentTime - this.lastUpdate > this.updateInterval) {
        const password = this.decode();
        const newPartialSalt = getRandomValues(new Uint8Array(16));
        this.salt.set(newPartialSalt, 0);
        this.data = this.encode(password);
        this.lastUpdate = currentTime;
      }
    });
  }

  public async getPassword(): Promise<string> {
    await this.updateEncoding();
    return this.mutex.runExclusive(() => this.decode());
  }

  public toString(): string {
    return '[SecurePassword]';
  }

  public toJSON(): string {
    return '[SecurePassword]';
  }
}

export default SecureMemoryPassword;
