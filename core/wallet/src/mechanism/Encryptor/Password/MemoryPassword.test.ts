import { beforeEach, describe, expect, test, vi} from 'vitest'
import MemoryPassword from './MemoryPassword';

describe('SecureMemoryPassword', () => {
  let memoryPassword: MemoryPassword;

  beforeEach(() => {
    memoryPassword = new MemoryPassword();
  });

  test('should set and get password correctly', async () => {
    const testPassword = 'MySecretPassword123!';
    memoryPassword.setPassword(testPassword);
    const retrievedPassword = await memoryPassword.getPassword();
    expect(retrievedPassword).toBe(testPassword);
  });

  test('should throw error when getting password before setting', async () => {
    await expect(memoryPassword.getPassword()).rejects.toThrow('Password is not set');
  });

  test('should update encoding after specified interval', async () => {
    vi.useFakeTimers();
    const updateInterval = 1000;
    memoryPassword = new MemoryPassword({ updateInterval });

    const testPassword = 'AnotherPassword456!';
    memoryPassword.setPassword(testPassword);

    // First retrieval
    let retrievedPassword = await memoryPassword.getPassword();
    expect(retrievedPassword).toBe(testPassword);

    // Advance time
    vi.advanceTimersByTime(updateInterval + 100);

    // Second retrieval should trigger update
    retrievedPassword = await memoryPassword.getPassword();
    expect(retrievedPassword).toBe(testPassword);

    vi.useRealTimers();
  });

  test('toString and toJSON should return [SecurePassword]', () => {
    expect(memoryPassword.toString()).toBe('[SecurePassword]');
    expect(memoryPassword.toJSON()).toBe('[SecurePassword]');
  });

  test('should handle concurrent access correctly', async () => {
    const testPassword = 'ConcurrentTestPassword';
    memoryPassword.setPassword(testPassword);

    const concurrentAccess = async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(memoryPassword.getPassword());
      }
      const results = await Promise.all(promises);
      results.forEach((result) => expect(result).toBe(testPassword));
    };

    await concurrentAccess();
  });

  test('should update internal data after interval while maintaining correct password', async () => {
    vi.useFakeTimers();
    const updateInterval = 1000;
    memoryPassword = new MemoryPassword({ updateInterval });

    const testPassword = 'UpdateTestPassword123!';
    memoryPassword.setPassword(testPassword);

    const initialInternalData = (memoryPassword as any).data.slice();

    let retrievedPassword = await memoryPassword.getPassword();
    expect(retrievedPassword).toBe(testPassword);

    vi.advanceTimersByTime(updateInterval + 100);

    retrievedPassword = await memoryPassword.getPassword();
    expect(retrievedPassword).toBe(testPassword);

    const updatedInternalData = (memoryPassword as any).data.slice();
    expect(updatedInternalData).not.toEqual(initialInternalData);

    vi.useRealTimers();
  });

  test('should use different salt for each encoding', async () => {
    const testPassword = 'SaltTestPassword456!';
    memoryPassword.setPassword(testPassword);

    const initialSalt = (memoryPassword as any).salt.slice();

    vi.useFakeTimers();
    vi.advanceTimersByTime(60000 * 6); // 6 minutes
    await memoryPassword.getPassword();

    const updatedSalt = (memoryPassword as any).salt.slice();

    expect(updatedSalt).not.toEqual(initialSalt);
    vi.useRealTimers();
  });

  test('should maintain correct password after multiple updates', async () => {
    vi.useFakeTimers();
    const updateInterval = 1000; // 1 second for testing
    memoryPassword = new MemoryPassword({ updateInterval });

    const testPassword = 'MultiUpdatePassword789!';
    memoryPassword.setPassword(testPassword);

    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(updateInterval + 100);
      const retrievedPassword = await memoryPassword.getPassword();
      expect(retrievedPassword).toBe(testPassword);
    }

    vi.useRealTimers();
  });

  test('should handle rapid consecutive calls correctly', async () => {
    const testPassword = 'RapidCallPassword000!';
    memoryPassword.setPassword(testPassword);

    const calls = 100;
    const results = await Promise.all(
      Array(calls).fill(null).map(() => memoryPassword.getPassword())
    );

    results.forEach(result => expect(result).toBe(testPassword));
  });
});
