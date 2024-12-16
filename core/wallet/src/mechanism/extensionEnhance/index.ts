
import { EXTENSION_TYPE } from '../../';
let browser: typeof import('webextension-polyfill');

(async function () {
  try {
    browser = await import('webextension-polyfill');
  } catch (error) {
    console.log('Not in extension environment');
  }
})();

export type UnknownTarget = Record<string, PropertyDescriptor['value']>;

/**
 * Proxy wallet methods, if it's popup, we send message to background to execute the method.
 * @param fns
 * @param extensionType
 * @returns
 */
export function sendMessagInPopup<T extends Record<string | symbol, any>>(fns: T, extensionType: EXTENSION_TYPE): T {
  return new Proxy(fns, {
    get: (target, prop) => {
      return async (...args: any[]) => {
        /**
         * if this is not popup, just call the original method
         */
        if (extensionType === 'background') {
          return target[prop](...args);
        }

        /**
         * if this is popup, we send message to background to execute the method.
         */

        const response = await browser.runtime.sendMessage({
          method: prop,
          args,
        });
        return response;
      };
    },
  });
}

export function listenMessageInBackgroundCallback(callback: (message: any) => any) {
  browser.runtime.onMessage.addListener(callback);
}