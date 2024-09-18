import InteractivePassword, { PasswordRequestTimeoutError, type PasswordRequest } from './InteractivePassword';

describe('InteractivePassword', () => {
  let interactivePassword: InteractivePassword;

  beforeEach(() => {
    interactivePassword = new InteractivePassword({
      cacheTime: 5,
      timeout: 10,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should emit password request and resolve password', async () => {
    const passwordPromise = interactivePassword.getPassword();

    expect(passwordPromise).toBeInstanceOf(Promise);

    interactivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.resolve('test-password');
      }, 1);
    });

    jest.advanceTimersByTime(2);
    const password = await passwordPromise;
    expect(password).toBe('test-password');
  });

  test('should throw timeout error', async () => {
    const promise = interactivePassword.getPassword();

    expect(promise).rejects.toThrow(PasswordRequestTimeoutError);
    jest.advanceTimersByTime(11);
  });

  test('should handle rejection', async () => {
    const passwordPromise = interactivePassword.getPassword();

    interactivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.reject(new Error('Custom error'));
      }, 1);
    });

    jest.advanceTimersByTime(2);
    await expect(passwordPromise).rejects.toThrow('Custom error');
  });

  test('should return same promise when last request not resolved', async () => {
    interactivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.resolve('test-password');
      }, 1);
    });

    const firstPromise = interactivePassword.getPassword();
    const secondPromise = interactivePassword.getPassword();
    expect(firstPromise).toEqual(secondPromise);

    jest.advanceTimersByTime(2);
    const password1 = await firstPromise;
    const password2 = await secondPromise;
    expect(password1).toBe('test-password');
    expect(password2).toBe('test-password');
  });

  test('should return cache pasaword within cacheTime', async () => {
    const sub = interactivePassword.passwordRequest$.subscribe((request) => {
      request.resolve('test-password');
      sub.unsubscribe();
    });
    const firstPromise = interactivePassword.getPassword();
    const password1 = await firstPromise;
    expect(password1).toBe('test-password');

    await new Promise((resolve) => {
      setTimeout(resolve, 1);
      jest.advanceTimersByTime(2);
    });

    const secondPromise = interactivePassword.getPassword();
    const password2 = await secondPromise;
    expect(password2).toBe('test-password');

    await new Promise((resolve) => {
      setTimeout(resolve, 11);
      jest.advanceTimersByTime(12);
    });
    const promise = interactivePassword.getPassword();
    expect(promise).rejects.toThrow(PasswordRequestTimeoutError);
    jest.advanceTimersByTime(11);
  });

  test('should clear cache after cacheTime', async () => {
    const customInteractivePassword = new InteractivePassword({ cacheTime: 1000 });

    const firstPromise = customInteractivePassword.getPassword();
    const sub1 = customInteractivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.resolve('initial-password');
        sub1.unsubscribe();
      }, 10);
    });

    jest.advanceTimersByTime(11);
    await firstPromise;
    const password1 = await firstPromise;
    expect(password1).toBe('initial-password');
    await new Promise((resolve) => {
      setTimeout(resolve, 1001);
      jest.advanceTimersByTime(1002);
    });

    const secondPromise = customInteractivePassword.getPassword();
    const sub2 = customInteractivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.resolve('new-password');
        sub2.unsubscribe();
      }, 10);
    });

    jest.advanceTimersByTime(11);
    const password2 = await secondPromise;
    expect(password2).toBe('new-password');
  });

  test('should handle multiple simultaneous requests', async () => {
    const promise1 = interactivePassword.getPassword();
    const promise2 = interactivePassword.getPassword();

    interactivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.resolve('test-password');
      }, 1);
    });

    jest.advanceTimersByTime(11);
    const [result1, result2] = await Promise.all([promise1, promise2]);
    expect(result1).toBe('test-password');
    expect(result2).toBe('test-password');
  });

  test('should clear cache when clearCache is called', async () => {
    const sub = interactivePassword.passwordRequest$.subscribe((request) => {
      request.resolve('test-password');
      sub.unsubscribe();
    });

    await interactivePassword.getPassword();

    interactivePassword.clearCache();

    const newPromise = interactivePassword.getPassword();
    expect(newPromise).not.toBe('test-password');
  });

  test('should emit the latest non-expired password request', async () => {
    const requests: PasswordRequest[] = [];
    const sub = interactivePassword.passwordRequest$.subscribe((request) => {
      request.resolve(`test-password-${requests.length}`);
      requests.push(request);
    });

    // First request
    const password1 = interactivePassword.getPassword();
    jest.advanceTimersByTime(1);

    // We expect to see the first request immediately
    expect(requests.length).toBe(1);
    expect(await password1).toBe('test-password-0');

    await new Promise((resolve) => {
      setTimeout(resolve, 2);
      jest.advanceTimersByTime(3);
    });

    const password2 =interactivePassword.getPassword();
    jest.advanceTimersByTime(1);

    // We should still only see the first request
    expect(requests.length).toBe(1);
    expect(await password2).toBe('test-password-0');

    await new Promise((resolve) => {
      setTimeout(resolve, 6);
      jest.advanceTimersByTime(7);
    });

    const password3 = interactivePassword.getPassword();
    jest.advanceTimersByTime(1);
    
    // Now we should see a new request
    expect(requests.length).toBe(2);
    expect(await password3).toBe('test-password-1');

    // Clean up
    sub.unsubscribe();
  });

    test('should not emit expired password requests for new subscribers', async () => {
    interactivePassword.getPassword();

    await new Promise((resolve) => {
      setTimeout(resolve, 11);
      jest.advanceTimersByTime(12);
    });

    const requests: PasswordRequest[] = [];
    interactivePassword.passwordRequest$.subscribe((request) => {
      requests.push(request);
    });

    expect(requests.length).toBe(0);
  });

  test('should emit not expired  password requests for new subscribers', async () => {
    interactivePassword.getPassword();

    await new Promise((resolve) => {
      setTimeout(resolve, 6);
      jest.advanceTimersByTime(7);
    });

    const requests: PasswordRequest[] = [];
    interactivePassword.passwordRequest$.subscribe((request) => {
      requests.push(request);
    });

    expect(requests.length).toBe(1);
  });
});
