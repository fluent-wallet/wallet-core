import InteractivePassword, { PasswordRequestTimeoutError } from './InteractivePassword';

describe('InteractivePassword', () => {
  let interactivePassword: InteractivePassword;

  beforeEach(() => {
    interactivePassword = new InteractivePassword({
      cacheTime: 5,
      timeout: 10
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
        request.resolve('test-password')
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

  test('should return same promise when last request not resolved', async () => {
    interactivePassword.passwordRequest$.subscribe((request) => {
      setTimeout(() => {
        request.resolve('test-password')
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
      request.resolve('test-password')
      sub.unsubscribe();
    });
    const firstPromise = interactivePassword.getPassword();
    const password1 = await firstPromise;
    expect(password1).toBe('test-password');

    await new Promise((resolve) => setTimeout(resolve, 2));
    jest.advanceTimersByTime(3);
    const secondPromise = interactivePassword.getPassword();
    const password2 = await secondPromise;
    expect(password2).toBe('test-password');
  });


  // test('should clear cache after specified time', async () => {
  //   const customInteractivePassword = new InteractivePassword({ cacheTime: 1000 });
    
  //   const firstPromise = customInteractivePassword.getPassword();
    
  //   customInteractivePassword.passwordRequest$.subscribe((request) => {
  //     setTimeout(() => {
  //       request.resolve('initial-password')
  //     }, 10);
  //   });

  //   jest.advanceTimersByTime(11);
  //   await firstPromise;

  //   jest.advanceTimersByTime(1001);

  //   const secondPromise = customInteractivePassword.getPassword();
    
  //   customInteractivePassword.passwordRequest$.subscribe((request) => {
  //     setTimeout(() => {
  //       request.resolve('new-password')
  //     }, 10);
  //   });

  //   jest.advanceTimersByTime(11);
  //   const password = await secondPromise;
  //   expect(password).toBe('new-password');
  // });

  // test('should timeout if password is not provided in time', async () => {
  //   const customInteractivePassword = new InteractivePassword({ timeout: 1000 });
  //   const passwordPromise = customInteractivePassword.getPassword();
    
  //   customInteractivePassword.passwordRequest$.subscribe(() => {
  //     // Do nothing, simulating no response
  //   });

  //   jest.advanceTimersByTime(1001);
  //   await expect(passwordPromise).rejects.toThrow('Password request timed out');
  // });

  // test('should handle multiple simultaneous requests', async () => {
  //   const promise1 = interactivePassword.getPassword();
  //   const promise2 = interactivePassword.getPassword();

  //   interactivePassword.passwordRequest$.subscribe((request) => {
  //     setTimeout(() => {
  //       request.resolve('simultaneous-password')
  //     }, 10);
  //   });

  //   jest.advanceTimersByTime(11);
  //   const [result1, result2] = await Promise.all([promise1, promise2]);
  //   expect(result1).toBe('simultaneous-password');
  //   expect(result2).toBe('simultaneous-password');
  // });

  // test('clearCache should remove cached password', async () => {
  //   const firstPromise = interactivePassword.getPassword();
    
  //   interactivePassword.passwordRequest$.subscribe((request) => {
  //     setTimeout(() => {
  //       request.resolve('initial-password')
  //     }, 10);
  //   });

  //   jest.advanceTimersByTime(11);
  //   await firstPromise;

  //   interactivePassword.clearCache();

  //   const secondPromise = interactivePassword.getPassword();
    
  //   interactivePassword.passwordRequest$.subscribe((request) => {
  //     setTimeout(() => {
  //       request.resolve('new-password')
  //     }, 10);
  //   });

  //   jest.advanceTimersByTime(11);
  //   const password = await secondPromise;
  //   expect(password).toBe('new-password');
  // });
});